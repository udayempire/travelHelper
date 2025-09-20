# Map Setup Instructions

## Mapbox Configuration

To enable the interactive map functionality, you need to set up a Mapbox access token:

### 1. Get a Mapbox Token

1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Sign up for a free account if you don't have one
3. Create a new access token
4. Copy the token

### 2. Set Environment Variable

Create a `.env.local` file in the web directory and add:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Restart Development Server

After adding the token, restart your Next.js development server:

```bash
npm run dev
```

## Features

- Interactive map with tourist locations
- Real-time marker updates
- Fullscreen mode
- Search and filtering
- Tourist information popups

## Troubleshooting

If the map doesn't load:
1. Check that your Mapbox token is valid
2. Ensure the token has the correct scopes
3. Verify the environment variable is set correctly
4. Check the browser console for errors
