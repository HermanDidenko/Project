using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookLibrary.Migrations
{
    public partial class AddPublisherRelationFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
        UPDATE `Books` SET `PublisherId` = NULL WHERE `PublisherId` = 0;
        UPDATE `Books` b
        LEFT JOIN `Publishers` p ON p.`Id` = b.`PublisherId`
        SET b.`PublisherId` = NULL
        WHERE b.`PublisherId` IS NOT NULL AND p.`Id` IS NULL;
    ");

            migrationBuilder.Sql(@"
        SET @fk_exists := (
          SELECT 1
          FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
          JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
            ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
           AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
          WHERE rc.CONSTRAINT_SCHEMA = DATABASE()
            AND rc.TABLE_NAME = 'Books'
            AND rc.REFERENCED_TABLE_NAME = 'Publishers'
            AND kcu.COLUMN_NAME = 'PublisherId'
          LIMIT 1
        );

        SET @add_fk_sql := IF(@fk_exists = 1, 'SELECT 1',
          'ALTER TABLE `Books` ADD CONSTRAINT `FK_Books_Publishers_PublisherId`
             FOREIGN KEY (`PublisherId`) REFERENCES `Publishers`(`Id`)
             ON DELETE SET NULL');
        PREPARE stmt FROM @add_fk_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
    ");
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
SET @fk_name := (
  SELECT rc.CONSTRAINT_NAME
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
  JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
    ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
   AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
  WHERE rc.CONSTRAINT_SCHEMA = DATABASE()
    AND rc.TABLE_NAME = 'Books'
    AND rc.REFERENCED_TABLE_NAME = 'Publishers'
    AND kcu.COLUMN_NAME = 'PublisherId'
  LIMIT 1
);

SET @drop_fk_sql := IF(@fk_name IS NULL, 'SELECT 1', CONCAT('ALTER TABLE `Books` DROP FOREIGN KEY `', @fk_name, '`'));
PREPARE stmt FROM @drop_fk_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
");

            migrationBuilder.Sql(@"
SET @idx_exists := (
  SELECT 1
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Books'
    AND INDEX_NAME = 'IX_Books_PublisherId'
  LIMIT 1
);

SET @drop_idx_sql := IF(@idx_exists = 1, 'DROP INDEX `IX_Books_PublisherId` ON `Books`', 'SELECT 1');
PREPARE stmt FROM @drop_idx_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
");

            migrationBuilder.AlterColumn<int>(
                name: "PublisherId",
                table: "Books",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
