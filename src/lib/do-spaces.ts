import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// DigitalOcean Spaces is S3-compatible. All Heart to Heart uploads live
// under the "H2H/" prefix inside the shared Space so they don't collide
// with other projects using the same bucket.
const FOLDER = "H2H";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

let client: S3Client | null = null;

// DO_ENDPOINT (e.g. https://ngowebsites.sfo3.digitaloceanspaces.com) already
// includes the bucket name as a subdomain. The S3 client also prepends the
// bucket for virtual-hosted-style addressing, so passing DO_ENDPOINT as-is
// would double it up (ngowebsites.ngowebsites.sfo3...). Strip the bucket
// subdomain off so the client is left with the bare regional endpoint.
function getRegionalEndpoint(): string {
  const endpoint = getEnv("DO_ENDPOINT");
  const space = getEnv("DO_SPACE");
  const prefix = `${space}.`;
  const url = new URL(endpoint);
  if (url.hostname.startsWith(prefix)) {
    url.hostname = url.hostname.slice(prefix.length);
  }
  return url.toString().replace(/\/$/, "");
}

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    endpoint: getRegionalEndpoint(),
    region: getEnv("DO_DEFAULT_REGION"),
    credentials: {
      accessKeyId: getEnv("DO_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("DO_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: false,
  });
  return client;
}

/**
 * Uploads a file buffer to the DigitalOcean Space under the H2H/ folder
 * and returns its public CDN URL.
 */
export async function uploadToSpaces(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const space = getEnv("DO_SPACE");
  const cdnEndpoint = getEnv("DO_CDN_ENDPOINT");
  const key = `${FOLDER}/${filename}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: space,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return `${cdnEndpoint.replace(/\/$/, "")}/${key}`;
}
