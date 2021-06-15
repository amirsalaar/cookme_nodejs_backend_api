/**
 * Permissions defined as power of 2
 * ALL_PERMISSION is the maximum value for a 32-bit integer
 */
export enum PermissionFlag {
  BASE_PERMISSION = 1,
  KITCHEN_TIER_1_PERMISSION = 2,
  KITCHEN_TIER_2_PERMISSION = 4,
  ADMIN_PERMISSION = 8,
  ALL_PERMISSION = 2147483647,
}
