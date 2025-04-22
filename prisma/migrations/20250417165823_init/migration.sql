-- CreateTable
CREATE TABLE `categorie` (
    `idCategory` VARCHAR(50) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `thumbnail` VARCHAR(255) NULL,

    UNIQUE INDEX `category`(`category`),
    PRIMARY KEY (`idCategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dettagli` (
    `idDettagli` VARCHAR(50) NOT NULL,
    `idMeal` VARCHAR(50) NOT NULL,
    `strInstructions` TEXT NULL,
    `strYoutube` VARCHAR(255) NULL,

    INDEX `idMeal`(`idMeal`),
    PRIMARY KEY (`idDettagli`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredienti` (
    `idIngredient` VARCHAR(50) NOT NULL,
    `idDettagli` VARCHAR(50) NOT NULL,
    `strIngredient` VARCHAR(100) NOT NULL,
    `strMeasure` VARCHAR(100) NULL,

    INDEX `idDettagli`(`idDettagli`),
    PRIMARY KEY (`idIngredient`, `idDettagli`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lista_spesa` (
    `idLista` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `idUtente` VARCHAR(36) NOT NULL,
    `idMeal` VARCHAR(45) NOT NULL,
    `idIngrediente` VARCHAR(36) NOT NULL,
    `ingrediente` VARCHAR(100) NOT NULL,
    `quantita` VARCHAR(100) NOT NULL,
    `acquistato` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`idLista`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preferiti` (
    `idPreferito` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `idUtente` VARCHAR(36) NOT NULL,
    `idMeal` VARCHAR(6) NOT NULL,

    PRIMARY KEY (`idPreferito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ricette` (
    `idMeal` VARCHAR(50) NOT NULL,
    `strMeal` VARCHAR(100) NOT NULL,
    `strMealThumb` VARCHAR(255) NULL,
    `strCategory` VARCHAR(50) NULL,
    `strArea` VARCHAR(50) NULL,
    `strTags` TEXT NULL,

    INDEX `fk_ricette_categorie`(`strCategory`),
    PRIMARY KEY (`idMeal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dettagli` ADD CONSTRAINT `dettagli_ibfk_1` FOREIGN KEY (`idMeal`) REFERENCES `ricette`(`idMeal`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ingredienti` ADD CONSTRAINT `ingredienti_ibfk_1` FOREIGN KEY (`idDettagli`) REFERENCES `dettagli`(`idDettagli`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ricette` ADD CONSTRAINT `fk_ricette_categorie` FOREIGN KEY (`strCategory`) REFERENCES `categorie`(`category`) ON DELETE NO ACTION ON UPDATE NO ACTION;
