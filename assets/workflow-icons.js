/**
 * Project Steve — Workflow Canvas SVG Icons & Node Metas
 * Authentic, handcrafted, optimized SVGs for n8n-style workflow visualization.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WorkflowIcons = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Real, authentic, production-grade vector SVGs (viewBox 0 0 24 24 or official geometry)
  var ICONS = {
    // Stripe (Official S-curve)
    stripe: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#635BFF"/>' +
      '<path fill="#FFFFFF" d="M14.6 10.15c0-.9-.72-1.28-1.92-1.28-1.74 0-3.56.54-4.8 1.25V6.44c1.46-.62 3.32-.94 4.88-.94 4.02 0 6.46 1.94 6.46 5.24 0 5.09-7 4.26-7 6.45 0 .97.85 1.34 2.15 1.34 2.05 0 4.25-.74 5.56-1.55v3.74c-1.57.73-3.66 1.08-5.64 1.08-4.25 0-6.79-2.03-6.79-5.32.02-5.46 7.1-4.43 7.1-6.33z"/>' +
      '</svg>',

    // PostgreSQL (Official Slonik elephant silhouette)
    postgres: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#336791"/>' +
      '<path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="M12.02 4c-3.1 0-5.6 1.83-6.08 4.27-.47-.13-.98-.2-1.51-.2-1.62 0-2.93.92-2.93 2.05 0 .93.88 1.71 2.11 1.97.02.72.18 1.44.47 2.11.39.91 1 1.68 1.76 2.22-.05.33-.08.67-.08 1.01 0 1.25.42 2.39 1.12 3.16.2.22.44.41.69.57.37.24.8.4 1.26.47.16.03.32.04.49.04.85 0 1.63-.33 2.17-.89.37-.38.61-.88.7-1.43.51.14 1.05.22 1.6.22 3.65 0 6.64-2.73 6.81-6.19.01-.13.02-.27.02-.4 0-4.96-3.41-8.98-7.61-8.98zm-2.07 13.88c-.14.15-.35.24-.59.24-.04 0-.08 0-.12-.01-.19-.03-.35-.11-.47-.23-.27-.29-.44-.81-.44-1.45 0-.58.14-1.12.38-1.54.34-.6 1.07-1.14 1.87-1.39.1.53.13 1.07.13 1.61 0 .28-.01.55-.03.82-.18.06-.52.26-.73.95zm5.7-4.14c-.05.13-.1.25-.16.37-.36.75-.95 1.34-1.68 1.68-.31.14-.65.23-1 .27.06-.48.09-.97.09-1.47 0-.74-.06-1.46-.19-2.15.54-.15 1.12-.23 1.73-.23.47 0 .91.05 1.33.15-.31.47-.69.96-1.12 1.38zm1.88-2.61c-.57-.22-1.22-.35-1.92-.35-.77 0-1.5.15-2.15.42-.14-.7-.41-1.35-.78-1.93.88-.34 1.88-.53 2.94-.53 1.05 0 2.03.18 2.89.51-.27.63-.61 1.27-.98 1.88z"/>' +
      '</svg>',

    // Slack (Official 4-color octothorpe)
    slack: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#4A154B"/>' +
      '<g transform="translate(4, 4) scale(0.6667)">' +
      '<path d="M5.5 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#36C5F0"/>' +
      '<path d="M7 10a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1-5 0v-6z" fill="#36C5F0"/>' +
      '<path d="M14 5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#2EB67D"/>' +
      '<path d="M14 7a2.5 2.5 0 0 1 0 5h-6a2.5 2.5 0 0 1 0-5h6z" fill="#2EB67D"/>' +
      '<path d="M18.5 14a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#E01E5A"/>' +
      '<path d="M17 14a2.5 2.5 0 0 1-5 0V8a2.5 2.5 0 0 1 5 0v6z" fill="#E01E5A"/>' +
      '<path d="M10 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#ECB22E"/>' +
      '<path d="M10 17a2.5 2.5 0 0 1 0-5h6a2.5 2.5 0 0 1 0 5h-6z" fill="#ECB22E"/>' +
      '</g>' +
      '</svg>',

    // Webhook (Signature n8n / automation anchor trigger)
    webhook: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#FF6D5A"/>' +
      '<path d="M17 8a3 3 0 1 0-2.82 4H13a3 3 0 0 1-3-3V8.82A3 3 0 1 0 8 6a3 3 0 0 0 4 2.82V9a5 5 0 0 0 5 5h1.18A3 3 0 1 0 17 8z" fill="#FFFFFF"/>' +
      '<path d="M8 15a3 3 0 1 0 2.82 4H12a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H9.82A3 3 0 0 0 8 15z" fill="#FFFFFF" fill-opacity="0.85"/>' +
      '</svg>',

    // Schedule / Cron (Precision timing trigger)
    schedule: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#4086E0"/>' +
      '<circle cx="12" cy="12" r="7" stroke="#FFFFFF" stroke-width="2"/>' +
      '<path d="M12 8.5v3.8l2.6 1.6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M12 2.5v1.5M12 20v1.5M2.5 12h1.5M20 12h1.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>' +
      '</svg>',

    // Gmail (Official Google red envelope)
    gmail: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#EA4335"/>' +
      '<path d="M5.5 7.5L12 12.3 18.5 7.5c.3.2.5.6.5 1v8c0 .8-.7 1.5-1.5 1.5H6.5c-.8 0-1.5-.7-1.5-1.5v-8c0-.4.2-.8.5-1z" fill="#FFFFFF"/>' +
      '<path d="M18.5 7.5L12 12.3 5.5 7.5A1.5 1.5 0 0 1 6.5 6h11c.4 0 .8.2 1 .5z" fill="#FFFFFF" fill-opacity="0.9"/>' +
      '<path d="M5 8.5L12 13.5l7-5" stroke="#EA4335" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // GitHub (Official Octocat silhouette)
    github: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#24292E"/>' +
      '<path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="M12 5C8.13 5 5 8.13 5 12c0 3.09 2.01 5.71 4.79 6.64.35.06.48-.15.48-.34 0-.17-.01-.73-.01-1.33-1.95.42-2.36-.83-2.36-.83-.32-.81-.78-1.03-.78-1.03-.64-.44.05-.43.05-.43.7.05 1.07.72 1.07.72.63 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.94-1.55-.18-3.19-.78-3.19-3.46 0-.76.27-1.39.72-1.88-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.92.72.56-.16 1.16-.23 1.75-.24.6 0 1.19.08 1.75.24 1.33-.91 1.92-.72 1.92-.72.38.96.14 1.67.07 1.85.45.49.71 1.11.71 1.88 0 2.7-1.64 3.28-3.2 3.45.25.22.48.65.48 1.32 0 .95-.01 1.72-.01 1.96 0 .19.13.41.48.34A7.005 7.005 0 0 0 19 12c0-3.87-3.13-7-7-7z"/>' +
      '</svg>',

    // OpenAI / AI Agent (Radial spiraling vortex)
    openai: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#10A37F"/>' +
      '<g fill="#FFFFFF">' +
      '<path d="M18.8 10.3a4.7 4.7 0 0 0-.4-3.7 4.8 4.8 0 0 0-4.4-2.4 4.8 4.8 0 0 0-1.7.3 4.8 4.8 0 0 0-3.6-1.5 4.8 4.8 0 0 0-4.6 3.4 4.7 4.7 0 0 0-2.4 3.7c0 .6.1 1.1.3 1.7a4.8 4.8 0 0 0 .4 3.7 4.8 4.8 0 0 0 4.4 2.4c.6 0 1.1-.1 1.7-.3a4.8 4.8 0 0 0 3.6 1.5 4.8 4.8 0 0 0 4.6-3.4 4.7 4.7 0 0 0 2.4-3.7c0-.6-.1-1.1-.3-1.7zm-6.8 8.4a3.5 3.5 0 0 1-2.2-.8l1.4-1.4a1.7 1.7 0 0 0 2.2-.4l1.3 1.3c-.8.8-1.7 1.3-2.7 1.3zm4.5-3.1l-1.4-1.4a1.7 1.7 0 0 0 .4-2.2l1.3-1.3a3.5 3.5 0 0 1 .8 2.2c0 1-.4 2-1.1 2.7zm-9.3-1.1l-1.3-1.3a3.5 3.5 0 0 1-.8-2.2c0-1 .4-2 1.1-2.7l1.4 1.4a1.7 1.7 0 0 0-.4 2.2zm1-4.7l1.4 1.4a1.7 1.7 0 0 0 2.2.4L10.5 8.4a3.5 3.5 0 0 1-2.2-.8zm6.5.6a1.7 1.7 0 0 0-2.2-.4L10.5 8.4c.8-.8 1.7-1.3 2.7-1.3a3.5 3.5 0 0 1 2.2.8l-1.4 1.4zm-2.7 3.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>' +
      '</g>' +
      '</svg>',

    // HTTP Request (Web API globe with directional exchange arrows)
    httprequest: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#0284C7"/>' +
      '<circle cx="12" cy="12" r="7" stroke="#FFFFFF" stroke-width="1.8"/>' +
      '<path d="M5 12h14M12 5a10 10 0 0 1 3 7 10 10 0 0 1-3 7 10 10 0 0 1-3-7 10 10 0 0 1 3-7z" stroke="#FFFFFF" stroke-width="1.6"/>' +
      '<path d="M16 8l3-3-3-3M8 16l-3 3 3 3" stroke="#BAE6FD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // Code / Function / Transform (Code brackets with magic transform sparkle)
    code: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#F59E0B"/>' +
      '<path d="M8.5 8.5L5 12l3.5 3.5M15.5 8.5L19 12l-3.5 3.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M13.5 7l-3 10" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>' +
      '</svg>',

    // Filter / If (Branching logic decision gate)
    filter: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#8B5CF6"/>' +
      '<path d="M5 6h14l-5.5 6.5v5.5l-3-1.5v-4z" fill="#FFFFFF"/>' +
      '<path d="M14.5 15.5l4 4m0-4l-4 4" stroke="#EDE9FE" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>',

    // Discord (Clyde controller)
    discord: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#5865F2"/>' +
      '<path fill="#FFFFFF" d="M18.2 6.5a13.3 13.3 0 0 0-3.3-1c-.1.3-.3.8-.5 1.1a12.3 12.3 0 0 0-4.8 0c-.2-.3-.4-.8-.5-1.1a13.2 13.2 0 0 0-3.3 1C4 9.1 3.5 13.6 4 17.5a13.4 13.4 0 0 0 4.1 2.1c.3-.4.6-.9.9-1.4-.7-.3-1.3-.6-1.9-1.1.2-.1.3-.2.5-.3a9.4 9.4 0 0 0 8.8 0c.2.1.3.2.5.3-.6.5-1.2.8-1.9 1.1.3.5.6 1 .9 1.4a13.4 13.4 0 0 0 4.1-2.1c.5-4.5-.4-9-1.8-11zm-8.7 8.3c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6s1.5.7 1.5 1.6c0 .9-.7 1.6-1.5 1.6zm5 0c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6s1.5.7 1.5 1.6c0 .9-.7 1.6-1.5 1.6z"/>' +
      '</svg>',

    // Airtable (Tri-color geometric blocks)
    airtable: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#FCB400"/>' +
      '<path d="M11.6 5.4a.8.8 0 0 1 .8 0l6.2 3.6c.3.2.4.5.2.8a.8.8 0 0 1-.2.3l-6.2 3.5a.8.8 0 0 1-.8 0L5.4 10a.8.8 0 0 1-.2-.8.8.8 0 0 1 .2-.3l6.2-3.5z" fill="#FFFFFF"/>' +
      '<path d="M12.4 13.6v6c0 .3.2.5.5.6l5.2-3c.3-.2.5-.5.5-.8V10.4L12.4 13.6z" fill="#18BFFF"/>' +
      '<path d="M11.6 13.6L5.4 10.4v6c0 .3.2.6.5.8l5.2 3c.3-.1.5-.3.5-.6v-6z" fill="#ED3F44"/>' +
      '</svg>',

    // Error / Alert / Error Trigger (Critical alert triangle)
    error: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#EF4444"/>' +
      '<path d="M12 6.5l7.5 12.5H4.5L12 6.5z" fill="#FFFFFF"/>' +
      '<path d="M12 11v3.5M12 16.5v.5" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>',

    // Respond to Webhook (Return response arrow)
    respond: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#10B981"/>' +
      '<path d="M8 9l-4 4 4 4" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M4 13h10a5 5 0 0 1 5 5v1" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // Email / SMTP (Send mail envelope)
    email: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#0EA5E9"/>' +
      '<rect x="4.5" y="6.5" width="15" height="11" rx="2" stroke="#FFFFFF" stroke-width="1.8"/>' +
      '<path d="M5 8l7 5 7-5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // Supabase (Official emerald energy bolt)
    supabase: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#1E293B"/>' +
      '<path d="M13.2 21.6a1.2 1.2 0 0 1-2.1-.9l.7-7.2H5.6a1.2 1.2 0 0 1-1-1.8L12.4 2.4a1.2 1.2 0 0 1 2.1.9l-.7 7.2h6.2a1.2 1.2 0 0 1 1 1.8l-7.8 9.3z" fill="#3ECF8E"/>' +
      '</svg>',

    // Google Sheets (Emerald tabular spreadsheet)
    googlesheets: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#0F9D58"/>' +
      '<path d="M7 5h7l5 5v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="#FFFFFF"/>' +
      '<path d="M14 5v5h5" fill="#C8E6C9"/>' +
      '<path d="M8.5 13h7M8.5 16h7M12 11.5v6" stroke="#0F9D58" stroke-width="1.4" stroke-linecap="round"/>' +
      '</svg>',

    // Redis (Layered memory cache stack)
    redis: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#DC382D"/>' +
      '<path d="M12 5.5l7 3.5-7 3.5-7-3.5 7-3.5z" fill="#FFFFFF"/>' +
      '<path d="M5 12l7 3.5 7-3.5M5 15.5l7 3.5 7-3.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // Telegram (Iconic paper airplane)
    telegram: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#229ED9"/>' +
      '<path d="M18.8 6.2l-13.6 5.3c-.9.4-.9 1 .1 1.3l3.5 1.1 8.1-5.1c.4-.2.7-.1.4.1l-6.6 6 0 0-.2 3.6c.4 0 .5-.2.7-.4l1.7-1.6 3.5 2.6c.6.4 1.1.2 1.3-.6l2.3-10.8c.2-.9-.3-1.3-1.2-.6z" fill="#FFFFFF"/>' +
      '</svg>',

    // Notion (Cube N monogram)
    notion: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#18181B"/>' +
      '<path d="M6 7.5L8.5 7l8.5-.5 1 1v10l-2.5 1-9.5.5-1-1V7.5z" fill="#FFFFFF"/>' +
      '<path d="M9.5 8.5v7l4-6.5v7" stroke="#18181B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    // Generic / Fallback Node
    generic: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="24" height="24" rx="5" fill="#64748B"/>' +
      '<rect x="7" y="7" width="10" height="10" rx="2.5" stroke="#FFFFFF" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="2" fill="#FFFFFF"/>' +
      '</svg>',

    // UI Controls Icons (Clean stroke-based vectors)
    zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    fitView: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><polyline points="21 15 21 21 15 21"/><polyline points="3 9 3 3 9 3"/></svg>',
    resetView: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>',
    viewCanvas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    viewJson: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'
  };

  // Color specs and metadata for services
  var SERVICE_CONFIG = {
    stripe: {
      key: 'stripe',
      name: 'Stripe',
      category: 'Payment',
      color: '#635BFF',
      bgColor: 'rgba(99, 91, 255, 0.08)',
      borderColor: 'rgba(99, 91, 255, 0.28)',
      glowColor: 'rgba(99, 91, 255, 0.35)',
      badge: 'Payments'
    },
    postgres: {
      key: 'postgres',
      name: 'PostgreSQL',
      category: 'Database',
      color: '#336791',
      bgColor: 'rgba(51, 103, 145, 0.08)',
      borderColor: 'rgba(51, 103, 145, 0.28)',
      glowColor: 'rgba(51, 103, 145, 0.35)',
      badge: 'Database'
    },
    slack: {
      key: 'slack',
      name: 'Slack',
      category: 'Communication',
      color: '#E01E5A',
      bgColor: 'rgba(74, 21, 75, 0.08)',
      borderColor: 'rgba(224, 30, 90, 0.28)',
      glowColor: 'rgba(224, 30, 90, 0.35)',
      badge: 'Messaging'
    },
    webhook: {
      key: 'webhook',
      name: 'Webhook',
      category: 'Trigger',
      color: '#FF6D5A',
      bgColor: 'rgba(255, 109, 90, 0.09)',
      borderColor: 'rgba(255, 109, 90, 0.30)',
      glowColor: 'rgba(255, 109, 90, 0.38)',
      badge: 'Trigger'
    },
    schedule: {
      key: 'schedule',
      name: 'Schedule',
      category: 'Trigger',
      color: '#4086E0',
      bgColor: 'rgba(64, 134, 224, 0.08)',
      borderColor: 'rgba(64, 134, 224, 0.28)',
      glowColor: 'rgba(64, 134, 224, 0.35)',
      badge: 'Cron / Timer'
    },
    gmail: {
      key: 'gmail',
      name: 'Gmail',
      category: 'Email',
      color: '#EA4335',
      bgColor: 'rgba(234, 67, 53, 0.08)',
      borderColor: 'rgba(234, 67, 53, 0.28)',
      glowColor: 'rgba(234, 67, 53, 0.35)',
      badge: 'Google Mail'
    },
    github: {
      key: 'github',
      name: 'GitHub',
      category: 'DevOps',
      color: '#24292E',
      bgColor: 'rgba(36, 41, 46, 0.08)',
      borderColor: 'rgba(36, 41, 46, 0.28)',
      glowColor: 'rgba(36, 41, 46, 0.35)',
      badge: 'Git / CI'
    },
    openai: {
      key: 'openai',
      name: 'OpenAI',
      category: 'AI / LLM',
      color: '#10A37F',
      bgColor: 'rgba(16, 163, 127, 0.08)',
      borderColor: 'rgba(16, 163, 127, 0.28)',
      glowColor: 'rgba(16, 163, 127, 0.35)',
      badge: 'Intelligence'
    },
    httprequest: {
      key: 'httprequest',
      name: 'HTTP Request',
      category: 'Network',
      color: '#0284C7',
      bgColor: 'rgba(2, 132, 199, 0.08)',
      borderColor: 'rgba(2, 132, 199, 0.28)',
      glowColor: 'rgba(2, 132, 199, 0.35)',
      badge: 'REST / API'
    },
    code: {
      key: 'code',
      name: 'Code / Set',
      category: 'Transform',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.28)',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      badge: 'Transform'
    },
    filter: {
      key: 'filter',
      name: 'Filter / If',
      category: 'Routing',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.28)',
      glowColor: 'rgba(139, 92, 246, 0.35)',
      badge: 'Condition'
    },
    discord: {
      key: 'discord',
      name: 'Discord',
      category: 'Communication',
      color: '#5865F2',
      bgColor: 'rgba(88, 101, 242, 0.08)',
      borderColor: 'rgba(88, 101, 242, 0.28)',
      glowColor: 'rgba(88, 101, 242, 0.35)',
      badge: 'Bot / Chat'
    },
    airtable: {
      key: 'airtable',
      name: 'Airtable',
      category: 'Database',
      color: '#FCB400',
      bgColor: 'rgba(252, 180, 0, 0.09)',
      borderColor: 'rgba(252, 180, 0, 0.30)',
      glowColor: 'rgba(252, 180, 0, 0.35)',
      badge: 'Base / Table'
    },
    error: {
      key: 'error',
      name: 'Error Handler',
      category: 'Monitoring',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.09)',
      borderColor: 'rgba(239, 68, 68, 0.32)',
      glowColor: 'rgba(239, 68, 68, 0.40)',
      badge: 'Catch'
    },
    respond: {
      key: 'respond',
      name: 'Respond to Webhook',
      category: 'Output',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.28)',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      badge: 'Response'
    },
    email: {
      key: 'email',
      name: 'Email (SMTP)',
      category: 'Output',
      color: '#0EA5E9',
      bgColor: 'rgba(14, 165, 233, 0.08)',
      borderColor: 'rgba(14, 165, 233, 0.28)',
      glowColor: 'rgba(14, 165, 233, 0.35)',
      badge: 'Notification'
    },
    supabase: {
      key: 'supabase',
      name: 'Supabase',
      category: 'Backend',
      color: '#3ECF8E',
      bgColor: 'rgba(62, 207, 142, 0.08)',
      borderColor: 'rgba(62, 207, 142, 0.28)',
      glowColor: 'rgba(62, 207, 142, 0.35)',
      badge: 'Postgres & Auth'
    },
    googlesheets: {
      key: 'googlesheets',
      name: 'Google Sheets',
      category: 'Productivity',
      color: '#0F9D58',
      bgColor: 'rgba(15, 157, 88, 0.08)',
      borderColor: 'rgba(15, 157, 88, 0.28)',
      glowColor: 'rgba(15, 157, 88, 0.35)',
      badge: 'Spreadsheet'
    },
    redis: {
      key: 'redis',
      name: 'Redis',
      category: 'Cache',
      color: '#DC382D',
      bgColor: 'rgba(220, 56, 45, 0.08)',
      borderColor: 'rgba(220, 56, 45, 0.28)',
      glowColor: 'rgba(220, 56, 45, 0.35)',
      badge: 'In-Memory'
    },
    telegram: {
      key: 'telegram',
      name: 'Telegram',
      category: 'Messaging',
      color: '#229ED9',
      bgColor: 'rgba(34, 158, 217, 0.08)',
      borderColor: 'rgba(34, 158, 217, 0.28)',
      glowColor: 'rgba(34, 158, 217, 0.35)',
      badge: 'Bot'
    },
    notion: {
      key: 'notion',
      name: 'Notion',
      category: 'Docs',
      color: '#18181B',
      bgColor: 'rgba(24, 24, 27, 0.08)',
      borderColor: 'rgba(24, 24, 27, 0.28)',
      glowColor: 'rgba(24, 24, 27, 0.35)',
      badge: 'Workspace'
    },
    generic: {
      key: 'generic',
      name: 'Node',
      category: 'Action',
      color: '#64748B',
      bgColor: 'rgba(100, 116, 139, 0.08)',
      borderColor: 'rgba(100, 116, 139, 0.25)',
      glowColor: 'rgba(100, 116, 139, 0.30)',
      badge: 'Task'
    }
  };

  /**
   * Intelligently resolves an n8n node to its corresponding service configuration.
   */
  function resolveServiceKey(node) {
    if (!node) return 'generic';

    var type = (node.type || '').toLowerCase();
    var name = (node.name || '').toLowerCase();
    var params = '';
    try {
      params = JSON.stringify(node.parameters || '').toLowerCase();
    } catch (e) {
      params = '';
    }

    var combined = type + ' ' + name + ' ' + params;

    if (combined.indexOf('stripe') !== -1) return 'stripe';
    if (combined.indexOf('postgres') !== -1 || combined.indexOf('pg') !== -1) return 'postgres';
    if (combined.indexOf('slack') !== -1) return 'slack';
    if (type.indexOf('respondto') !== -1 || name.indexOf('respond') !== -1) return 'respond';
    if (type.indexOf('errortrigger') !== -1 || combined.indexOf('error') !== -1) return 'error';
    if (type.indexOf('webhook') !== -1) return 'webhook';
    if (type.indexOf('schedule') !== -1 || type.indexOf('cron') !== -1 || type.indexOf('interval') !== -1 || name.indexOf('daily') !== -1 || name.indexOf('schedule') !== -1) return 'schedule';
    if (combined.indexOf('gmail') !== -1) return 'gmail';
    if (combined.indexOf('github') !== -1) return 'github';
    if (combined.indexOf('airtable') !== -1) return 'airtable';
    if (combined.indexOf('discord') !== -1) return 'discord';
    if (combined.indexOf('openai') !== -1 || combined.indexOf('gpt') !== -1 || type.indexOf('langchain') !== -1 || /\bai\b/.test(combined)) return 'openai';
    if (type.indexOf('httprequest') !== -1 || combined.indexOf('http') !== -1 || combined.indexOf('fetch') !== -1 || combined.indexOf('request') !== -1 || combined.indexOf('api') !== -1) return 'httprequest';
    if (type.indexOf('code') !== -1 || type.indexOf('function') !== -1 || type.indexOf('set') !== -1 || combined.indexOf('code') !== -1 || combined.indexOf('transform') !== -1 || combined.indexOf('script') !== -1) return 'code';
    if (type.indexOf('if') !== -1 || type.indexOf('filter') !== -1 || type.indexOf('switch') !== -1 || combined.indexOf('filter') !== -1 || combined.indexOf('condition') !== -1) return 'filter';
    if (type.indexOf('httprequest') !== -1 || combined.indexOf('http') !== -1 || combined.indexOf('fetch') !== -1) return 'httprequest';
    if (type.indexOf('code') !== -1 || type.indexOf('function') !== -1 || type.indexOf('set') !== -1 || combined.indexOf('transform') !== -1) return 'code';
    if (type.indexOf('if') !== -1 || type.indexOf('filter') !== -1 || type.indexOf('switch') !== -1) return 'filter';
    if (type.indexOf('emailsend') !== -1 || combined.indexOf('email') !== -1 || combined.indexOf('mail') !== -1) return 'email';
    if (combined.indexOf('sheets') !== -1) return 'googlesheets';
    if (combined.indexOf('supabase') !== -1) return 'supabase';
    if (combined.indexOf('redis') !== -1) return 'redis';
    if (combined.indexOf('telegram') !== -1) return 'telegram';
    if (combined.indexOf('notion') !== -1) return 'notion';

    return 'generic';
  }

  /**
   * Returns complete metadata and styling attributes for any node.
   */
  function getNodeMeta(node) {
    var key = resolveServiceKey(node);
    var config = SERVICE_CONFIG[key] || SERVICE_CONFIG.generic;
    var iconSvg = ICONS[key] || ICONS.generic;

    var displayName = (node && node.name) ? node.name : config.name;
    // Format camelCase or snake_case names if needed
    var subtitle = config.category;
    if (node && node.type) {
      var parts = node.type.split('.');
      var simpleType = parts[parts.length - 1];
      if (simpleType && simpleType.length > 0) {
        subtitle = simpleType.charAt(0).toUpperCase() + simpleType.slice(1);
      }
    }

    return {
      serviceKey: key,
      displayName: displayName,
      subtitle: subtitle,
      badge: config.badge,
      color: config.color,
      bgColor: config.bgColor,
      borderColor: config.borderColor,
      glowColor: config.glowColor,
      iconSvg: iconSvg
    };
  }

  function getIcon(key) {
    return ICONS[key] || ICONS.generic;
  }

  return {
    ICONS: ICONS,
    SERVICE_CONFIG: SERVICE_CONFIG,
    resolveServiceKey: resolveServiceKey,
    getNodeMeta: getNodeMeta,
    getIcon: getIcon
  };
});
