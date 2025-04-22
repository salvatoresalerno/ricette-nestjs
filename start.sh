#!/bin/bash

echo "➡️ Avvio deploy delle migrazioni Prisma..."
npx prisma migrate deploy

echo "✅ Migrazioni applicate. Avvio dell'app NestJS..."
npm run start:prod