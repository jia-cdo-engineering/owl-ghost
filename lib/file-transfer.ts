// lib/file-transfer.ts

import crypto from 'crypto';

// Function to generate a key for encryption
const generateKey = (password: string): Buffer => {
    return crypto.scryptSync(password, 'salt', 24);
};

// Function to encrypt data
export const encrypt = (data: string, password: string): { iv: Buffer; encryptedData: Buffer } => {
    const iv = crypto.randomBytes(16);
    const key = generateKey(password);
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);

    const encryptedData = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return { iv, encryptedData };
};

// Function to decrypt data
export const decrypt = (encryptedData: Buffer, iv: Buffer, password: string): string => {
    const key = generateKey(password);
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decryptedData.toString();
};

// Example usage
const password = 'your-secure-password';
const originalData = 'This is confidential data.';

const { iv, encryptedData } = encrypt(originalData, password);
console.log('Encrypted:', encryptedData.toString('hex'));

const decryptedData = decrypt(encryptedData, iv, password);
console.log('Decrypted:', decryptedData);