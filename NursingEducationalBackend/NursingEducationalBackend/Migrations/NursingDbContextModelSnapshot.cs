﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NursingEducationalBackend.Models;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    [DbContext(typeof(NursingDbContext))]
    partial class NursingDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.2");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("TEXT");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Adl", b =>
                {
                    b.Property<int>("AdlsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("ADLsID");

                    b.Property<DateOnly>("BathDate")
                        .HasColumnType("DATE");

                    b.Property<string>("FootCare")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("HairCare")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Teeth")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TubShowerOther")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TurningSchedule")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TypeOfCare")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AdlsId");

                    b.ToTable("ADLs", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Behaviour", b =>
                {
                    b.Property<int>("BehaviourId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("BehaviourID");

                    b.Property<string>("Report")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("BehaviourId");

                    b.ToTable("Behaviour", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Cognitive", b =>
                {
                    b.Property<int>("CognitiveId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("CognitiveID");

                    b.Property<string>("Confusion")
                        .HasColumnType("TEXT");

                    b.Property<string>("Loc")
                        .HasColumnType("TEXT")
                        .HasColumnName("LOC");

                    b.Property<string>("Mmse")
                        .HasColumnType("TEXT")
                        .HasColumnName("MMSE");

                    b.Property<string>("Speech")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("CognitiveId");

                    b.ToTable("Cognitive", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Elimination", b =>
                {
                    b.Property<int>("EliminationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("EliminationID");

                    b.Property<string>("BladderRoutine")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("BowelRoutine")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("CatheterInsertion")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("CatheterInsertionDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("DayOrNightProduct")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("IncontinentOfBladder")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("IncontinentOfBowel")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("LastBowelMovement")
                        .HasColumnType("TEXT");

                    b.HasKey("EliminationId");

                    b.ToTable("Elimination", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Mobility", b =>
                {
                    b.Property<int>("MobilityId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("MobilityID");

                    b.Property<string>("Aids")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("BedMobility")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Transfer")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("MobilityId");

                    b.ToTable("Mobility", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Nurse", b =>
                {
                    b.Property<int>("NurseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("NurseID");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FullName")
                        .HasColumnType("TEXT");

                    b.Property<int?>("PatientId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("PatientID");

                    b.Property<string>("StudentNumber")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("NurseId");

                    b.HasIndex(new[] { "PatientId" }, "IX_Nurse_PatientID")
                        .IsUnique();

                    b.ToTable("Nurse", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Nutrition", b =>
                {
                    b.Property<int>("NutritionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("NutritionID");

                    b.Property<string>("Assit")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Diet")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("DietarySupplementInfo")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Intake")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("IvSolutionRate")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Method")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SpecialNeeds")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Time")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Weight")
                        .HasColumnType("INTEGER");

                    b.HasKey("NutritionId");

                    b.ToTable("Nutrition", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Patient", b =>
                {
                    b.Property<string>("PatientWristId")
                        .HasColumnType("TEXT")
                        .HasColumnName("PatientWristID");

                    b.Property<DateOnly>("AdmissionDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Allergies")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("BedNumber")
                        .HasColumnType("INTEGER");

                    b.Property<DateOnly?>("DischargeDate")
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("Dob")
                        .HasColumnType("TEXT")
                        .HasColumnName("DOB");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Height")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageFilename")
                        .HasColumnType("TEXT");

                    b.Property<string>("IsolationPrecautions")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("MaritalStatus")
                        .HasColumnType("TEXT");

                    b.Property<string>("MedicalHistory")
                        .HasColumnType("TEXT");

                    b.Property<string>("NextOfKin")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("NextOfKinPhone")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("NurseId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("NurseID");

                    b.Property<int>("PatientId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("PatientID");

                    b.Property<string>("RoamAlertBracelet")
                        .HasColumnType("TEXT");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Weight")
                        .HasColumnType("INTEGER");

                    b.HasKey("PatientWristId");

                    b.HasIndex("NurseId");

                    b.HasIndex(new[] { "PatientId" }, "IX_Patient_PatientID")
                        .IsUnique();

                    b.ToTable("Patient", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.ProgressNote", b =>
                {
                    b.Property<int>("ProgressNoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("ProgressNoteID");

                    b.Property<string>("Note")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("DATETIME");

                    b.HasKey("ProgressNoteId");

                    b.ToTable("ProgressNote", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Record", b =>
                {
                    b.Property<int>("RecordId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("RecordID");

                    b.Property<int?>("AdlsId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("ADLsID");

                    b.Property<int?>("BehaviourId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("BehaviourID");

                    b.Property<int?>("CognitiveId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("CognitiveID");

                    b.Property<int?>("EliminationId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("EliminationID");

                    b.Property<int?>("MobilityId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("MobilityID");

                    b.Property<int?>("NutritionId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("NutritionID");

                    b.Property<int?>("PatientId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("PatientID");

                    b.Property<int?>("ProgressNoteId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("ProgressNoteID");

                    b.Property<int?>("SafetyId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("SafetyID");

                    b.Property<int?>("SkinId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("SkinID");

                    b.HasKey("RecordId");

                    b.HasIndex("PatientId");

                    b.ToTable("Record", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Safety", b =>
                {
                    b.Property<int>("SafetyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("SafetyID");

                    b.Property<string>("BedAlarm")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("CrashMats")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FallRiskScale")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("HipProtectors")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SideRails")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("SafetyId");

                    b.ToTable("Safety", (string)null);
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.SkinAndSensoryAid", b =>
                {
                    b.Property<int>("SkinAndSensoryAidsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("SkinAndSensoryAidsID");

                    b.Property<string>("Glasses")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Hearing")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SkinIntegrityBradenScale")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SkinIntegrityDressings")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SkinIntegrityPressureUlcerRisk")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SkinIntegrityTurningSchedule")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("SkinAndSensoryAidsId");

                    b.ToTable("SkinAndSensoryAids");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Patient", b =>
                {
                    b.HasOne("NursingEducationalBackend.Models.Nurse", "Nurse")
                        .WithMany("Patients")
                        .HasForeignKey("NurseId");

                    b.Navigation("Nurse");
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Record", b =>
                {
                    b.HasOne("NursingEducationalBackend.Models.Patient", "Patient")
                        .WithMany("Records")
                        .HasForeignKey("PatientId")
                        .HasPrincipalKey("PatientId");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Nurse", b =>
                {
                    b.Navigation("Patients");
                });

            modelBuilder.Entity("NursingEducationalBackend.Models.Patient", b =>
                {
                    b.Navigation("Records");
                });
#pragma warning restore 612, 618
        }
    }
}
