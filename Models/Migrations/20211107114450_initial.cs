using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Models.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Table = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AuditDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecordKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => new { x.RecordKey, x.Username, x.AuditDate, x.Table, x.Action });
                });

            migrationBuilder.CreateTable(
                name: "AuthorLogs",
                columns: table => new
                {
                    Table = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AuthorDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorCount = table.Column<int>(type: "int", nullable: false),
                    RecordKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthorLogs", x => new { x.RecordKey, x.Username, x.AuthorDate, x.Table, x.AuthorCount });
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ParentMenus",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AreaName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsReport = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParentMenus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SystemUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateAuthorised = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorisedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AuthStatus = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    AuthCount = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CanCreate = table.Column<bool>(type: "bit", nullable: false),
                    CanRead = table.Column<bool>(type: "bit", nullable: false),
                    CanUpdate = table.Column<bool>(type: "bit", nullable: false),
                    CanDelete = table.Column<bool>(type: "bit", nullable: false),
                    CanAuthorise = table.Column<bool>(type: "bit", nullable: false),
                    CanRetrieveReports = table.Column<bool>(type: "bit", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateAuthorised = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorisedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AuthStatus = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    AuthCount = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubMenus",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentMenuID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ControllerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CaptureAuditTrail = table.Column<bool>(type: "bit", nullable: false),
                    Authorisers = table.Column<int>(type: "int", nullable: false),
                    Visible = table.Column<bool>(type: "bit", nullable: false),
                    Creatable = table.Column<bool>(type: "bit", nullable: false),
                    Readable = table.Column<bool>(type: "bit", nullable: false),
                    Updatable = table.Column<bool>(type: "bit", nullable: false),
                    Deletable = table.Column<bool>(type: "bit", nullable: false),
                    Authorizable = table.Column<bool>(type: "bit", nullable: false),
                    RetrieveReports = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubMenus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubMenus_ParentMenus_ParentMenuID",
                        column: x => x.ParentMenuID,
                        principalTable: "ParentMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SystemUserProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserProfileID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    SystemUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateAuthorised = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorisedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AuthStatus = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    AuthCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemUserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SystemUserProfiles_SystemUsers_SystemUserId",
                        column: x => x.SystemUserId,
                        principalTable: "SystemUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SystemUserProfiles_UserProfiles_UserProfileID",
                        column: x => x.UserProfileID,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SubMenuID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ReportFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReportUIModel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Report_SubMenus_SubMenuID",
                        column: x => x.SubMenuID,
                        principalTable: "SubMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileMenus",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserProfileID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SubMenuID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CanCreate = table.Column<bool>(type: "bit", nullable: false),
                    CanRead = table.Column<bool>(type: "bit", nullable: false),
                    CanUpdate = table.Column<bool>(type: "bit", nullable: false),
                    CanDelete = table.Column<bool>(type: "bit", nullable: false),
                    CanAuthorise = table.Column<bool>(type: "bit", nullable: false),
                    CanRetrieveReports = table.Column<bool>(type: "bit", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateAuthorised = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorisedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AuthStatus = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    AuthCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileMenus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileMenus_SubMenus_SubMenuID",
                        column: x => x.SubMenuID,
                        principalTable: "SubMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileMenus_UserProfiles_UserProfileID",
                        column: x => x.UserProfileID,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileReports",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserProfileID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ReportID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DateAuthorised = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorisedBy = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AuthStatus = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    AuthCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileReports_Report_ReportID",
                        column: x => x.ReportID,
                        principalTable: "Report",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileReports_UserProfiles_UserProfileID",
                        column: x => x.UserProfileID,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Report_SubMenuID",
                table: "Report",
                column: "SubMenuID");

            migrationBuilder.CreateIndex(
                name: "IX_SubMenus_ParentMenuID",
                table: "SubMenus",
                column: "ParentMenuID");

            migrationBuilder.CreateIndex(
                name: "IX_SystemUserProfiles_SystemUserId",
                table: "SystemUserProfiles",
                column: "SystemUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemUserProfiles_UserProfileID",
                table: "SystemUserProfiles",
                column: "UserProfileID");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileMenus_SubMenuID",
                table: "UserProfileMenus",
                column: "SubMenuID");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileMenus_UserProfileID",
                table: "UserProfileMenus",
                column: "UserProfileID");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileReports_ReportID",
                table: "UserProfileReports",
                column: "ReportID");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileReports_UserProfileID",
                table: "UserProfileReports",
                column: "UserProfileID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "AuthorLogs");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "SystemUserProfiles");

            migrationBuilder.DropTable(
                name: "UserProfileMenus");

            migrationBuilder.DropTable(
                name: "UserProfileReports");

            migrationBuilder.DropTable(
                name: "SystemUsers");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "SubMenus");

            migrationBuilder.DropTable(
                name: "ParentMenus");
        }
    }
}
