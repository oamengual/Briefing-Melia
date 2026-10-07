import { Brand, BrandAsset } from './types';

export const INITIAL_MELIA_BRANDS: Brand[] = [];
export const INITIAL_MELIA_ASSETS: BrandAsset[] = [];

INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_corporate', type: 'logo', name: 'Meliá Hotels International Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAyQzVGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+TWVsacOhIEhvdGVscyBJbnRlcm5hdGlvbmFsPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_corporate',
        name: 'Meliá Hotels International',
        colors: ["#002C5F", "#FFFFFF"],
        logoIds: ['asset_logo_brand_corporate'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_meliarewards', type: 'logo', name: 'MeliáRewards Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzBBMUMyQSIgLz4KICAgICAgICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRDRBRjM3IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+TWVsacOhUmV3YXJkczwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_meliarewards',
        name: 'MeliáRewards',
        colors: ["#0A1C2A", "#D4AF37", "#FFFFFF"],
        logoIds: ['asset_logo_brand_meliarewards'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_granmelia', type: 'logo', name: 'Gran Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSInVGltZXMgTmV3IFJvbWFuJywgVGltZXMsIHNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAwMDAwIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMnB4Ij5HcmFuIE1lbGnDoTwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_granmelia',
        name: 'Gran Meliá',
        colors: ["#000000", "#D4AF37", "#FFFFFF"],
        logoIds: ['asset_logo_brand_granmelia'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_me', type: 'logo', name: 'ME by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjRweCI+TUUgYnkgTWVsacOhPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_me',
        name: 'ME by Meliá',
        colors: ["#000000", "#D81B60", "#FFFFFF"],
        logoIds: ['asset_logo_brand_me'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_collection', type: 'logo', name: 'The Meliá Collection Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSInVGltZXMgTmV3IFJvbWFuJywgVGltZXMsIHNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjNEE0QTRBIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMnB4Ij5UaGUgTWVsacOhIENvbGxlY3Rpb248L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_collection',
        name: 'The Meliá Collection',
        colors: ["#4A4A4A", "#E8E4D9", "#FFFFFF"],
        logoIds: ['asset_logo_brand_collection'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_paradisus', type: 'logo', name: 'Paradisus Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSInVGltZXMgTmV3IFJvbWFuJywgVGltZXMsIHNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDA2OTk0IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMnB4Ij5QYXJhZGlzdXM8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_paradisus',
        name: 'Paradisus',
        colors: ["#006994", "#EEDC9A", "#FFFFFF"],
        logoIds: ['asset_logo_brand_paradisus'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_melia', type: 'logo', name: 'Meliá Hotels & Resorts Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAyQzVGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+TWVsacOhIEhvdGVscyAmIFJlc29ydHM8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_melia',
        name: 'Meliá Hotels & Resorts',
        colors: ["#002C5F", "#FFFFFF"],
        logoIds: ['asset_logo_brand_melia'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_zel', type: 'logo', name: 'ZEL Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzU1NkIyRiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjRweCI+WkVMPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_zel',
        name: 'ZEL',
        colors: ["#556B2F", "#E2725B", "#C2B280"],
        logoIds: ['asset_logo_brand_zel'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_innside', type: 'logo', name: 'INNSiDE by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjRkZDMTA3IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+SU5OU2lERSBieSBNZWxpw6E8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_innside',
        name: 'INNSiDE by Meliá',
        colors: ["#FFC107", "#000000", "#FFFFFF"],
        logoIds: ['asset_logo_brand_innside'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_sol', type: 'logo', name: 'Sol by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDBCQ0Q0IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+U29sIGJ5IE1lbGnDoTwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_sol',
        name: 'Sol by Meliá',
        colors: ["#00BCD4", "#FFEB3B", "#FFFFFF"],
        logoIds: ['asset_logo_brand_sol'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_affiliated', type: 'logo', name: 'Affiliated by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMkMzRTUwIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+QWZmaWxpYXRlZCBieSBNZWxpw6E8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_affiliated',
        name: 'Affiliated by Meliá',
        colors: ["#2C3E50", "#FFFFFF"],
        logoIds: ['asset_logo_brand_affiliated'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_falcons', type: 'logo', name: 'Falcon's Resorts Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjOEU0NEFEIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+RmFsY29uJ3MgUmVzb3J0czwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_falcons',
        name: 'Falcon's Resorts',
        colors: ["#8E44AD", "#FFFFFF"],
        logoIds: ['asset_logo_brand_falcons'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_pro', type: 'logo', name: 'Meliá PRO Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAyQzVGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+TWVsacOhIFBSTzwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_pro',
        name: 'Meliá PRO',
        colors: ["#002C5F", "#000000", "#FFFFFF"],
        logoIds: ['asset_logo_brand_pro'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_escapes', type: 'logo', name: 'Meliá Escapes Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAyQzVGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMCI+TWVsacOhIEVzY2FwZXM8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_escapes',
        name: 'Meliá Escapes',
        colors: ["#002C5F", "#FFFFFF"],
        logoIds: ['asset_logo_brand_escapes'],
        fontIds: {}
    });
