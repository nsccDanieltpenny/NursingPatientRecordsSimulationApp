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

public virtual DbSet<ChangeHistory> ChangeHistory { get; set; }
    public virtual DbSet<Behaviour> Behaviours { get; set; }


    public virtual DbSet<Cognitive> Cognitives { get; set; }

    public virtual DbSet<Elimination> Eliminations { get; set; }

    public virtual DbSet<Mobility> Mobilities { get; set; }

    public virtual DbSet<Nurse> Nurses { get; set; }

    public virtual DbSet<Nutrition> Nutritions { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<ProgressNote> ProgressNotes { get; set; }

    public virtual DbSet<Record> Records { get; set; }

    public virtual DbSet<Safety> Safeties { get; set; }

    public virtual DbSet<SkinAndSensoryAid> SkinAndSensoryAids { get; set; }
    
    public virtual DbSet<Class> Classes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString); // Changed from UseSqlite
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Call base first to configure Identity tables
        base.OnModelCreating(modelBuilder);

        // Configure Identity tables for SQL Server
        modelBuilder.Entity<IdentityUser>(entity => {
            entity.Property(e => e.Id).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityRole>(entity => {
            entity.Property(e => e.Id).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityUserRole<string>>(entity => {
            entity.Property(e => e.RoleId).HasColumnType("nvarchar(450)");
            entity.Property(e => e.UserId).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityUserClaim<string>>(entity => {
            entity.Property(e => e.UserId).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityUserLogin<string>>(entity => {
            entity.Property(e => e.UserId).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityRoleClaim<string>>(entity => {
            entity.Property(e => e.RoleId).HasColumnType("nvarchar(450)");
        });
        modelBuilder.Entity<IdentityUserToken<string>>(entity => {
            entity.Property(e => e.UserId).HasColumnType("nvarchar(450)");
        });

        modelBuilder.Entity<Adl>(entity =>
        {
            entity.HasKey(e => e.AdlsId);

            entity.ToTable("ADLs");

            entity.Property(e => e.AdlsId).HasColumnName("ADLsID");
            entity.Property(e => e.BathDate).HasColumnType("date"); // Changed from "DATE"
        });

        modelBuilder.Entity<Behaviour>(entity =>
        {
            entity.ToTable("Behaviour");

            entity.Property(e => e.BehaviourId).HasColumnName("BehaviourID");
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

        modelBuilder.Entity<Mobility>(entity =>
        {
            entity.ToTable("Mobility");

            entity.Property(e => e.MobilityId).HasColumnName("MobilityID");
        });

        modelBuilder.Entity<Nurse>(entity =>
        {
            entity.ToTable("Nurse");

            entity.HasIndex(e => e.PatientId, "IX_Nurse_PatientID").IsUnique();

            entity.Property(e => e.NurseId).HasColumnName("NurseID");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.ClassId).HasColumnName("ClassID");
            
            // Configure Nurse's relationship with Class (one-to-many)
            entity.HasOne(n => n.Class)
                  .WithMany(c => c.Students)
                  .HasForeignKey(n => n.ClassId)
                  .OnDelete(DeleteBehavior.SetNull); // If a class is deleted, students remain but their ClassId is set to null
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
            entity.Property(e => e.Timestamp).HasColumnType("datetime2"); // Changed from "DATETIME"
        });

        modelBuilder.Entity<Record>(entity =>
        {
            entity.ToTable("Record");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.AdlsId).HasColumnName("ADLsID");
            entity.Property(e => e.BehaviourId).HasColumnName("BehaviourID");
            entity.Property(e => e.CognitiveId).HasColumnName("CognitiveID");
            entity.Property(e => e.EliminationId).HasColumnName("EliminationID");
            entity.Property(e => e.MobilityId).HasColumnName("MobilityID");
            entity.Property(e => e.NutritionId).HasColumnName("NutritionID");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.ProgressNoteId).HasColumnName("ProgressNoteID");
            entity.Property(e => e.SafetyId).HasColumnName("SafetyID");
            entity.Property(e => e.SkinId).HasColumnName("SkinID");

            entity.HasOne(d => d.Patient).WithMany(p => p.Records)
                .HasPrincipalKey(p => p.PatientId)
                .HasForeignKey(d => d.PatientId);
        });

        modelBuilder.Entity<Safety>(entity =>
        {
            entity.ToTable("Safety");

            entity.Property(e => e.SafetyId).HasColumnName("SafetyID");
        });

        modelBuilder.Entity<SkinAndSensoryAid>(entity =>
        {
            entity.HasKey(e => e.SkinAndSensoryAidsId);

            entity.Property(e => e.SkinAndSensoryAidsId).HasColumnName("SkinAndSensoryAidsID");
        });

        // Configure Class entity
        modelBuilder.Entity<Class>(entity =>
        {
            entity.ToTable("Class");
            
            entity.Property(e => e.ClassId).HasColumnName("ClassID");
            entity.Property(e => e.InstructorId).HasColumnName("InstructorID");
            
            // Configure Class's relationship with Instructor (one-to-one)
            entity.HasOne(c => c.Instructor)
                  .WithMany()
                  .HasForeignKey(c => c.InstructorId)
                  .OnDelete(DeleteBehavior.SetNull); // If an instructor is deleted, keep the class but set InstructorId to null
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}