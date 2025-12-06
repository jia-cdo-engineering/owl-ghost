// lib/file-transfer.ts
import { pbkdf2, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ITERATIONS = 100000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

// Function for input validation
const validateInputs = (data: string, password: string): boolean => {
    if (!data || typeof data !== 'string') {
        throw new Error('Invalid data: Must be a non-empty string');
    }
    if (!password || typeof password !== 'string') {
        throw new Error('Invalid password: Must be a non-empty string');
    }
    return true;
};

// Encrypt function
export const encrypt = (data: string, password: string): { salt: Buffer; iv: Buffer; encrypted: Buffer; tag: Buffer } => {
    validateInputs(data, password);

    const salt = randomBytes(SALT_LENGTH);
    const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return { salt, iv, encrypted, tag };
};

// Decrypt function
export const decrypt = (salt: Buffer, iv: Buffer, encrypted: Buffer, tag: Buffer, password: string): string => {
    validateInputs(encrypted.toString('utf8'), password);

    const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
};
