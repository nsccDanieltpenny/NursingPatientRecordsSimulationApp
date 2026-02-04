using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace NursingEducationalBackend.Models;

public partial class NursingDbContext : IdentityDbContext<IdentityUser>
{
    public NursingDbContext() : base()
    {
    }

    public NursingDbContext(DbContextOptions<NursingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Adl> Adls { get; set; }

    public virtual DbSet<AssessmentSubmission> AssessmentSubmissions { get; set;}
    
    public virtual DbSet<AssessmentType> AssessmentTypes { get; set; }

    public virtual DbSet<Behaviour> Behaviours { get; set; }

    public virtual DbSet<Cognitive> Cognitives { get; set; }

    public virtual DbSet<Elimination> Eliminations { get; set; }

    public virtual DbSet<MobilityAndSafety> MobilityAndSafeties { get; set; }

    public virtual DbSet<Nurse> Nurses { get; set; }

    public virtual DbSet<Nutrition> Nutritions { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<ProgressNote> ProgressNotes { get; set; }

    public virtual DbSet<Record> Records { get; set; }

    public virtual DbSet<SkinAndSensoryAid> SkinAndSensoryAids { get; set; }
    
    public virtual DbSet<Class> Classes { get; set; }

    public virtual DbSet<Rotation> Rotations { get; set; }

    public virtual DbSet<RotationAssessment> RotationsAssessments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Call base first to configure Identity tables
        base.OnModelCreating(modelBuilder);

        // Configure custom table mappings for Identity (optional)
        // modelBuilder.Entity<IdentityUser>().ToTable("Users");
        // modelBuilder.Entity<IdentityRole>().ToTable("Roles");
        // modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        // modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        // modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        // modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        // modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");

        modelBuilder.Entity<Adl>(entity =>
        {
            entity.HasKey(e => e.AdlId);

            entity.ToTable("ADLs");

            entity.Property(e => e.AdlId).HasColumnName("ADLsID");
            entity.Property(e => e.BathDate).HasColumnType("DATE");
        });

        modelBuilder.Entity<Behaviour>(entity =>
        {
            entity.ToTable("Behaviour");

            entity.Property(e => e.BehaviourId).HasColumnName("BehaviourID");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.ToTable("Class");

            entity.HasOne(c => c.Instructor).WithMany().HasForeignKey(c => c.InstructorId);

            entity.HasIndex(e => e.JoinCode, "IX_Class_JoinCode").IsUnique();
        });

        modelBuilder.Entity<Cognitive>(entity =>
        {
            entity.ToTable("Cognitive");

            entity.Property(e => e.CognitiveId).HasColumnName("CognitiveID");
            entity.Property(e => e.Loc).HasColumnName("LOC");
            entity.Property(e => e.Mmse).HasColumnName("MMSE");
        });

        modelBuilder.Entity<Elimination>(entity =>
        {
            entity.ToTable("Elimination");

            entity.Property(e => e.EliminationId).HasColumnName("EliminationID");
        });

        modelBuilder.Entity<MobilityAndSafety>(entity =>
        {
            entity.ToTable("MobilityAndSafety");

            entity.Property(e => e.MobilityAndSafetyId).HasColumnName("MobilityAndSafetyID");
        });

        modelBuilder.Entity<Nurse>(entity =>
        {
            entity.ToTable("Nurse");

            entity.HasIndex(e => e.PatientId, "IX_Nurse_PatientID").IsUnique();

            entity.Property(e => e.NurseId).HasColumnName("NurseID");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");

            entity.HasOne(e => e.Class).WithMany(c => c.Students).HasForeignKey(e => e.ClassId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Nutrition>(entity =>
        {
            entity.ToTable("Nutrition");

            entity.Property(e => e.NutritionId).HasColumnName("NutritionID");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.PatientId);

            entity.ToTable("Patient");

            entity.HasIndex(e => e.PatientId, "IX_Patient_PatientID").IsUnique();

            entity.Property(e => e.PatientWristId).HasColumnName("PatientWristID");
            entity.Property(e => e.Dob).HasColumnName("DOB");
            entity.Property(e => e.NurseId).HasColumnName("NurseID");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");

            entity.HasOne(d => d.Nurse).WithMany(p => p.Patients).HasForeignKey(d => d.NurseId);
        });

        modelBuilder.Entity<ProgressNote>(entity =>
        {
            entity.ToTable("ProgressNote");

            entity.Property(e => e.ProgressNoteId).HasColumnName("ProgressNoteID");
            entity.Property(e => e.Timestamp).HasColumnType("DATETIME");
        });

        modelBuilder.Entity<Record>(entity =>
        {
            entity.ToTable("Record");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");

            entity.HasOne(d => d.Patient).WithMany(p => p.Records)
                .HasPrincipalKey(p => p.PatientId)
                .HasForeignKey(d => d.PatientId);
        });

        modelBuilder.Entity<SkinAndSensoryAid>(entity =>
        {
            entity.HasKey(e => e.SkinAndSensoryAidsId);

            entity.Property(e => e.SkinAndSensoryAidsId).HasColumnName("SkinAndSensoryAidsID");
        });

        //Rotations and Assessments
        modelBuilder.Entity<Rotation>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(50);

            //Create our Rotations, since we know them ahead of time. Hardcode IDs so we don't get drift when adding assessments.
            entity.HasData(
                new Rotation { RotationId = 1, Name = "LTC" }
            );
        });

        modelBuilder.Entity<AssessmentType>(entity =>
        {
            entity.HasData(
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.ADL, Name = "ADLs", RouteKey = "ADL" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.Behaviour, Name = "Behaviour", RouteKey = "Behaviour" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.Cognitive, Name = "Cognitive", RouteKey = "Cognitive" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.Elimination, Name = "Elimination", RouteKey = "Elimination" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.MobilityAndSafety, Name = "Mobility And Safety", RouteKey = "MobilityAndSafety" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.Nutrition, Name = "Nutrition", RouteKey = "Nutrition" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.ProgressNote, Name = "Progress Note", RouteKey = "ProgressNote" },
                new AssessmentType { AssessmentTypeId = (int)AssessmentTypeEnum.SkinAndSensoryAid, Name = "Sensory Aids / Prothesis / Skin Integrity", RouteKey = "SkinSensoryAid" }
            );
        });

        modelBuilder.Entity<RotationAssessment>(entity =>
        {
            entity.HasData(
                //LTC Assessments
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.ADL },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.Behaviour },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.Cognitive },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.Elimination },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.MobilityAndSafety },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.Nutrition },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.ProgressNote },
                new RotationAssessment { RotationId = 1, AssessmentTypeId = (int)AssessmentTypeEnum.SkinAndSensoryAid }
            );
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}