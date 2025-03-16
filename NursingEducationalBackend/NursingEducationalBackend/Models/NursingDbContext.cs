using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NursingEducationalBackend.Models;

public partial class NursingDbContext : DbContext
{
    public NursingDbContext()
    {
    }

    public NursingDbContext(DbContextOptions<NursingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Adl> Adls { get; set; }

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
        modelBuilder.Entity<Adl>(entity =>
        {
            entity.HasKey(e => e.AdlsId);

            entity.ToTable("ADLs");

            entity.Property(e => e.AdlsId).HasColumnName("ADLsID");
            entity.Property(e => e.BathDate).HasColumnType("DATE");
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
        });

        modelBuilder.Entity<Nutrition>(entity =>
        {
            entity.ToTable("Nutrition");

            entity.Property(e => e.NutritionId).HasColumnName("NutritionID");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.PatientWristId);

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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
