-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('stripe', 'helloasso', 'tipeee');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('subscription_creation', 'subscription_update', 'donation', 'subscription', 'other');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('youtube');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('channel', 'video', 'playlist', 'playlistItem');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "id_token" TEXT,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "scope" TEXT,
    "session_state" TEXT,
    "token_type" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "payments" (
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "source" "PaymentSource" NOT NULL,
    "type" "PaymentType" NOT NULL,
    "customers" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "displayHour" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "displayContact" BOOLEAN NOT NULL DEFAULT true,
    "displayEvent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "source" "MediaSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_video" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "thumbnailMaxResolution" TEXT,
    "channelId" TEXT,
    "channelTitle" TEXT,
    "playlistTitle" TEXT,
    "playlistId" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_channel" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_playlist" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "channelId" TEXT,
    "channelTitle" TEXT,
    "thumbnail" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT DEFAULT '',
    "xId" TEXT DEFAULT '',
    "profilePicture" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "payments_date_source_type_key" ON "payments"("date", "source", "type");

-- CreateIndex
CREATE UNIQUE INDEX "media_channel_mediaId_key" ON "media_channel"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "media_playlist_mediaId_key" ON "media_playlist"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "authors_id_key" ON "authors"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_video" ADD CONSTRAINT "media_video_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_channel" ADD CONSTRAINT "media_channel_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_playlist" ADD CONSTRAINT "media_playlist_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

