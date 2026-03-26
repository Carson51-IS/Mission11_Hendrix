/** Session key for "Continue shopping" return URL (set when adding to cart). */
export const RETURN_URL_SESSION_KEY = 'hiltonbookstore-return-url';

export function getContinueShoppingUrl(): string {
  return sessionStorage.getItem(RETURN_URL_SESSION_KEY) || '/';
}
