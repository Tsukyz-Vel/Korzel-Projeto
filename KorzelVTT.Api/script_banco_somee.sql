IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AudioTracks] (
    [Id] int NOT NULL IDENTITY,
    [CampaignId] int NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    [Base64Data] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_AudioTracks] PRIMARY KEY ([Id])
);

CREATE TABLE [Campaigns] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [MasterUserId] int NOT NULL,
    [InviteCode] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Campaigns] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Username] nvarchar(100) NOT NULL,
    [Email] nvarchar(150) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [IsBlocked] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [Scenes] (
    [Id] int NOT NULL IDENTITY,
    [CampaignId] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [BgImage] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Scenes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Scenes_Campaigns_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Characters] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [CampaignId] int NULL,
    [Name] nvarchar(100) NOT NULL,
    [Origin] nvarchar(100) NOT NULL,
    [Race] nvarchar(100) NOT NULL,
    [Class] nvarchar(100) NOT NULL,
    [Age] int NOT NULL,
    [Level] int NOT NULL,
    [Deity] nvarchar(100) NOT NULL,
    [Mut1] nvarchar(max) NOT NULL,
    [Mut2] nvarchar(max) NOT NULL,
    [Mut3] nvarchar(max) NOT NULL,
    [Intellect] int NOT NULL,
    [Presence] int NOT NULL,
    [Agility] int NOT NULL,
    [Vigor] int NOT NULL,
    [Strength] int NOT NULL,
    [Instinct] int NOT NULL,
    [CurrentHP] int NOT NULL,
    [MaxHP] int NOT NULL,
    [CurrentPE] int NOT NULL,
    [MaxPE] int NOT NULL,
    [Corruption] int NOT NULL,
    [MaxCorruption] int NOT NULL,
    [Lascas] int NOT NULL,
    [BaseDefense] int NOT NULL,
    [Resistances] nvarchar(max) NULL,
    [OficioText] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Characters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Characters_Campaigns_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns] ([Id]),
    CONSTRAINT [FK_Characters_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SceneTokens] (
    [Id] int NOT NULL IDENTITY,
    [SceneId] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Image] nvarchar(max) NULL,
    [ControlledBy] nvarchar(max) NULL,
    [IsNpc] bit NOT NULL,
    [X] float NOT NULL,
    [Y] float NOT NULL,
    [Size] float NOT NULL,
    [ZIndex] int NOT NULL,
    CONSTRAINT [PK_SceneTokens] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SceneTokens_Scenes_SceneId] FOREIGN KEY ([SceneId]) REFERENCES [Scenes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Abilities] (
    [Id] int NOT NULL IDENTITY,
    [CharacterId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Cost] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Abilities] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Abilities_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CharacterItems] (
    [Id] int NOT NULL IDENTITY,
    [CharacterId] int NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Quantity] int NOT NULL,
    [Weight] float NOT NULL,
    [IsEquipped] bit NOT NULL,
    [ItemType] nvarchar(max) NOT NULL,
    [ArmorBonus] int NOT NULL,
    [ArmorPenalty] int NOT NULL,
    [MaxAgility] int NULL,
    CONSTRAINT [PK_CharacterItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CharacterItems_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CharacterSkills] (
    [Id] int NOT NULL IDENTITY,
    [CharacterId] int NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [TrainingLevel] int NOT NULL,
    [Others] int NOT NULL,
    CONSTRAINT [PK_CharacterSkills] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CharacterSkills_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Notes] (
    [Id] int NOT NULL IDENTITY,
    [CharacterId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Notes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notes_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Weapons] (
    [Id] int NOT NULL IDENTITY,
    [CharacterId] int NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Damage] nvarchar(max) NOT NULL,
    [CritMargin] nvarchar(max) NOT NULL,
    [CritMultiplier] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Skill] nvarchar(max) NOT NULL,
    [IsRanged] bit NOT NULL,
    [Ammo] int NOT NULL,
    CONSTRAINT [PK_Weapons] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Weapons_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Abilities_CharacterId] ON [Abilities] ([CharacterId]);

CREATE INDEX [IX_CharacterItems_CharacterId] ON [CharacterItems] ([CharacterId]);

CREATE INDEX [IX_Characters_CampaignId] ON [Characters] ([CampaignId]);

CREATE INDEX [IX_Characters_UserId] ON [Characters] ([UserId]);

CREATE INDEX [IX_CharacterSkills_CharacterId] ON [CharacterSkills] ([CharacterId]);

CREATE INDEX [IX_Notes_CharacterId] ON [Notes] ([CharacterId]);

CREATE INDEX [IX_Scenes_CampaignId] ON [Scenes] ([CampaignId]);

CREATE INDEX [IX_SceneTokens_SceneId] ON [SceneTokens] ([SceneId]);

CREATE INDEX [IX_Weapons_CharacterId] ON [Weapons] ([CharacterId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260530234443_InicialSqlServer', N'10.0.8');

COMMIT;
GO

