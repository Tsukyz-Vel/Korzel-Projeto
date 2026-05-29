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
CREATE TABLE [Campaigns] (
    [Id] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [MasterUserId] INTEGER NOT NULL,
    [InviteCode] TEXT NOT NULL,
    [CreatedAt] TEXT NOT NULL,
    CONSTRAINT [PK_Campaigns] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] INTEGER NOT NULL,
    [Username] TEXT NOT NULL,
    [Email] TEXT NOT NULL,
    [PasswordHash] TEXT NOT NULL,
    [CreatedAt] TEXT NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [Scenes] (
    [Id] INTEGER NOT NULL,
    [CampaignId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [BgImage] TEXT NULL,
    [IsActive] INTEGER NOT NULL,
    CONSTRAINT [PK_Scenes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Scenes_Campaigns_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Characters] (
    [Id] INTEGER NOT NULL,
    [UserId] INTEGER NOT NULL,
    [CampaignId] INTEGER NULL,
    [Name] TEXT NOT NULL,
    [Origin] TEXT NOT NULL,
    [Race] TEXT NOT NULL,
    [Class] TEXT NOT NULL,
    [Age] INTEGER NOT NULL,
    [Level] INTEGER NOT NULL,
    [Deity] TEXT NOT NULL,
    [Mut1] TEXT NOT NULL,
    [Mut2] TEXT NOT NULL,
    [Mut3] TEXT NOT NULL,
    [Intellect] INTEGER NOT NULL,
    [Presence] INTEGER NOT NULL,
    [Agility] INTEGER NOT NULL,
    [Vigor] INTEGER NOT NULL,
    [Strength] INTEGER NOT NULL,
    [Instinct] INTEGER NOT NULL,
    [CurrentHP] INTEGER NOT NULL,
    [MaxHP] INTEGER NOT NULL,
    [CurrentPE] INTEGER NOT NULL,
    [MaxPE] INTEGER NOT NULL,
    [Corruption] INTEGER NOT NULL,
    [MaxCorruption] INTEGER NOT NULL,
    [Lascas] INTEGER NOT NULL,
    [BaseDefense] INTEGER NOT NULL,
    [CreatedAt] TEXT NOT NULL,
    CONSTRAINT [PK_Characters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Characters_Campaigns_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns] ([Id]),
    CONSTRAINT [FK_Characters_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SceneTokens] (
    [Id] INTEGER NOT NULL,
    [SceneId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [Image] TEXT NULL,
    [ControlledBy] TEXT NULL,
    [IsNpc] INTEGER NOT NULL,
    [X] REAL NOT NULL,
    [Y] REAL NOT NULL,
    [Size] REAL NOT NULL,
    [ZIndex] INTEGER NOT NULL,
    CONSTRAINT [PK_SceneTokens] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SceneTokens_Scenes_SceneId] FOREIGN KEY ([SceneId]) REFERENCES [Scenes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Abilities] (
    [Id] INTEGER NOT NULL,
    [CharacterId] INTEGER NOT NULL,
    [Title] TEXT NOT NULL,
    [Type] TEXT NOT NULL,
    [Cost] TEXT NOT NULL,
    [Description] TEXT NOT NULL,
    CONSTRAINT [PK_Abilities] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Abilities_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CharacterItems] (
    [Id] INTEGER NOT NULL,
    [CharacterId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [Description] TEXT NOT NULL,
    [Quantity] INTEGER NOT NULL,
    [Weight] REAL NOT NULL,
    [IsEquipped] INTEGER NOT NULL,
    [ItemType] TEXT NOT NULL,
    [ArmorBonus] INTEGER NOT NULL,
    [ArmorPenalty] INTEGER NOT NULL,
    [MaxAgility] INTEGER NULL,
    CONSTRAINT [PK_CharacterItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CharacterItems_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CharacterSkills] (
    [Id] INTEGER NOT NULL,
    [CharacterId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [TrainingLevel] INTEGER NOT NULL,
    [Others] INTEGER NOT NULL,
    CONSTRAINT [PK_CharacterSkills] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CharacterSkills_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Notes] (
    [Id] INTEGER NOT NULL,
    [CharacterId] INTEGER NOT NULL,
    [Title] TEXT NOT NULL,
    [Content] TEXT NOT NULL,
    CONSTRAINT [PK_Notes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notes_Characters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [Characters] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Weapons] (
    [Id] INTEGER NOT NULL,
    [CharacterId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [Damage] TEXT NOT NULL,
    [CritMargin] TEXT NOT NULL,
    [CritMultiplier] TEXT NOT NULL,
    [Type] TEXT NOT NULL,
    [Skill] TEXT NOT NULL,
    [IsRanged] INTEGER NOT NULL,
    [Ammo] INTEGER NOT NULL,
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
VALUES (N'20260521020926_InitialCreate', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [AudioTracks] (
    [Id] INTEGER NOT NULL,
    [CampaignId] INTEGER NOT NULL,
    [Name] TEXT NOT NULL,
    [Category] TEXT NOT NULL,
    [Base64Data] TEXT NOT NULL,
    CONSTRAINT [PK_AudioTracks] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260525023114_AddAudioTracks', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260528021543_AdicionandoOficio', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Characters] ADD [OficioText] TEXT NULL;

ALTER TABLE [Characters] ADD [Resistances] TEXT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260528024332_AdicionandoColunasFaltantes', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Users] ADD [IsBlocked] INTEGER NOT NULL DEFAULT CAST(0 AS INTEGER);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260528033027_AdicionandoBloqueioDeConta', N'10.0.8');

COMMIT;
GO

