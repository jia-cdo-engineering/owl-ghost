import { v4 as uuidv4 } from 'uuid';

export class DeviceAuth {
  private publicKey: CryptoKey;
  private privateKey: CryptoKey;

  constructor() {
    this.generateKeyPair();
  }

  private async generateKeyPair() {
    const keys = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256"
      },
      true,
      ["sign", "verify"]
    );
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;
  }

  public async signData(data: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
      },
      this.privateKey,
      encoder.encode(data)
    );
    return signature;
  }

  public async verifySignature(data: string, signature: ArrayBuffer): Promise<boolean> {
    const encoder = new TextEncoder();
    return await window.crypto.subtle.verify(
      {
        name: "ECDSA",
      },
      this.publicKey,
      signature,
      encoder.encode(data)
    );
  }

  public static generateDeviceId(): string {
    return uuidv4();
  }
}

// Example usage
(async () => {
  const deviceAuth = new DeviceAuth();
  const deviceId = DeviceAuth.generateDeviceId();
  const data = "Test data for signing";

  const signature = await deviceAuth.signData(data);
  const isValid = await deviceAuth.verifySignature(data, signature);
  console.log(`Device ID: ${deviceId}, Signature Valid: ${isValid}`);
})();
