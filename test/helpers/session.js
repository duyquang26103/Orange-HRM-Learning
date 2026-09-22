// test/helpers/session.js
import { browser } from '@wdio/globals';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// import { useState } from 'react';

const SESSION_FILE = './.session.json';

/**
 * Đăng nhập qua UI MỘT LẦN và lưu cookie ra file.
 * Chỉ gọi hàm này khi chưa có file session hợp lệ.
 */
async function createSession (username, password) {
  const LoginPage = (await import('../pageobjects/login-page/LoginPage')).default;

  await LoginPage.open();
  await LoginPage.login(username, password);

  // Chờ chắc chắn đã vào được bên trong
  await browser.waitUntil(
    async () => (await browser.getUrl()).includes('dashboard'),
    { timeout: 15000, timeoutMsg: 'Đăng nhập không thành công' }
  );

  const cookies = await browser.getCookies();
  writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2));
  return cookies;
}

/**
 * Nạp session đã lưu vào phiên trình duyệt hiện tại.
 * Trả về true nếu nạp được, false nếu chưa có file.
 */
async function loadSession () {
  if (!existsSync(SESSION_FILE)) return false;

  const cookies = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));

  // Phải mở trang cùng domain TRƯỚC khi set cookie
  await browser.url('/web/index.php/auth/login');
  await browser.setCookies(cookies);
  return true;
}

export async function ensureLoggedIn(username, password){
  const isLoaded = await loadSession();
  if(isLoaded){
    return;
  }
  await createSession(username, password);
}