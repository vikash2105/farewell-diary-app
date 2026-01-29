/**
 * Security Utilities for Input Sanitization
 * Prevents XSS, SQL Injection, and other attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Replaces dangerous characters with HTML entities
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize text input
 * Removes control characters and trims whitespace
 */
export const sanitizeText = (input: string, maxLength: number = 5000): string => {
  if (!input) return '';
  
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, maxLength);
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) throw new Error('Email is required');
  
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }
  
  return cleaned;
};

/**
 * Sanitize username
 * Only allows alphanumeric characters and underscores
 */
export const sanitizeUsername = (username: string): string => {
  if (!username) throw new Error('Username is required');
  
  const cleaned = username.trim().toLowerCase();
  const usernameRegex = /^[a-z0-9_]{3,50}$/;
  
  if (!usernameRegex.test(cleaned)) {
    throw new Error('Username must be 3-50 characters and contain only letters, numbers, and underscores');
  }
  
  return cleaned;
};

/**
 * Sanitize URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
};

/**
 * Sanitize object keys to prevent prototype pollution
 */
export const sanitizeObjectKeys = <T extends Record<string, any>>(obj: T): T => {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (const key of Object.keys(obj)) {
    if (dangerousKeys.includes(key)) {
      delete obj[key];
    }
  }
  
  return obj;
};
