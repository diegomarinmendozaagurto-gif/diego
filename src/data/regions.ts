import type { Region } from "../types/cloud";

export const regions: Region[] = [
  {
    id: "us-east-1",
    region: "us-east-1",
    location: "Virginia, EE.UU.",
    deployedServices: ["EC2", "S3", "RDS", "Lambda"],
    status: "ok",
    load: 72,
    latency: "42ms",
  },
  {
    id: "us-west-2",
    region: "us-west-2",
    location: "Oregón, EE.UU.",
    deployedServices: ["EC2", "S3", "CloudFront", "SQS"],
    status: "ok",
    load: 54,
    latency: "68ms",
  },
  {
    id: "sa-east-1",
    region: "sa-east-1",
    location: "São Paulo, Brasil",
    deployedServices: ["EC2", "RDS"],
    status: "warning",
    load: 63,
    latency: "95ms",
  },
  {
    id: "eu-west-1",
    region: "eu-west-1",
    location: "Irlanda",
    deployedServices: ["Lambda", "DynamoDB", "S3"],
    status: "ok",
    load: 66,
    latency: "52ms",
  },
  {
    id: "eu-central-1",
    region: "eu-central-1",
    location: "Frankfurt, Alemania",
    deployedServices: ["EC2", "RDS", "ElastiCache"],
    status: "warning",
    load: 58,
    latency: "71ms",
  },
  {
    id: "ap-southeast-1",
    region: "ap-southeast-1",
    location: "Singapur",
    deployedServices: ["EC2", "S3", "Lightsail"],
    status: "error",
    load: 81,
    latency: "128-180ms",
  },
];

export const regionPositions: Record<string, { x: number; y: number }> = {
  "us-east-1": { x: 72, y: 30 },
  "us-west-2": { x: 17, y: 28 },
  "sa-east-1": { x: 38, y: 68 },
  "eu-west-1": { x: 49, y: 26 },
  "eu-central-1": { x: 57, y: 34 },
  "ap-southeast-1": { x: 85, y: 58 },
};