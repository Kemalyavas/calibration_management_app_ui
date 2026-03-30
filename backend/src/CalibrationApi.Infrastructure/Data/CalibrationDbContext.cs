using CalibrationApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.Infrastructure.Data;

public class CalibrationDbContext : DbContext
{
    public CalibrationDbContext(DbContextOptions<CalibrationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Machine> Machines => Set<Machine>();
    public DbSet<CalibrationType> CalibrationTypes => Set<CalibrationType>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Calibration> Calibrations => Set<Calibration>();
    public DbSet<MeasurementPoint> MeasurementPoints => Set<MeasurementPoint>();
    public DbSet<ApprovalRequest> ApprovalRequests => Set<ApprovalRequest>();
    public DbSet<CalibrationFile> CalibrationFiles => Set<CalibrationFile>();
    public DbSet<Procedure> Procedures => Set<Procedure>();
    public DbSet<DeviceVerificationValue> DeviceVerificationValues => Set<DeviceVerificationValue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Username).HasMaxLength(50);
            e.Property(u => u.PasswordHash).HasMaxLength(256);
            e.Property(u => u.FullName).HasMaxLength(100);
        });

        // Department
        modelBuilder.Entity<Department>(e =>
        {
            e.Property(d => d.Name).HasMaxLength(100);
        });

        // Machine
        modelBuilder.Entity<Machine>(e =>
        {
            e.Property(m => m.Name).HasMaxLength(100);
            e.HasOne(m => m.Department).WithMany(d => d.Machines).HasForeignKey(m => m.DepartmentId);
        });

        // CalibrationType
        modelBuilder.Entity<CalibrationType>(e =>
        {
            e.Property(c => c.Name).HasMaxLength(50);
        });

        // Device
        modelBuilder.Entity<Device>(e =>
        {
            e.HasIndex(d => d.DeviceCode).IsUnique();
            e.Property(d => d.DeviceCode).HasMaxLength(20);
            e.Property(d => d.DeviceName).HasMaxLength(200);
            e.Property(d => d.Brand).HasMaxLength(100);
            e.Property(d => d.Model).HasMaxLength(100);
            e.Property(d => d.Manufacturer).HasMaxLength(200);
            e.Property(d => d.Unit).HasMaxLength(50);
            e.Property(d => d.LocationOfUse).HasMaxLength(200);
            e.Property(d => d.ProcedureNumber).HasMaxLength(50);
            e.Property(d => d.CalibratedBy).HasMaxLength(200);
            e.Property(d => d.MeasurementAccuracy).HasMaxLength(100);
            e.Property(d => d.ReferenceCode).HasMaxLength(50);
            e.Property(d => d.CalibrationFrequency).HasMaxLength(50);
            e.Property(d => d.TechnicalTolerance).HasMaxLength(50);
            e.Property(d => d.MinRange).HasColumnType("decimal(18,7)");
            e.Property(d => d.MaxRange).HasColumnType("decimal(18,7)");

            e.HasOne(d => d.Machine).WithMany(m => m.Devices).HasForeignKey(d => d.MachineId).IsRequired(false);
        });

        // DeviceVerificationValue
        modelBuilder.Entity<DeviceVerificationValue>(e =>
        {
            e.Property(v => v.VerificationValue).HasColumnType("decimal(18,7)");
            e.Property(v => v.ToleranceValue).HasColumnType("decimal(18,7)");
            e.Property(v => v.UncertaintyValue).HasColumnType("decimal(18,7)");
            e.HasOne(v => v.Device).WithMany(d => d.VerificationValues).HasForeignKey(v => v.DeviceId);
        });

        // Calibration
        modelBuilder.Entity<Calibration>(e =>
        {
            e.Property(c => c.Temperature).HasColumnType("decimal(5,1)");
            e.Property(c => c.Humidity).HasColumnType("decimal(5,1)");
            e.Property(c => c.Pressure).HasColumnType("decimal(7,1)");
            e.Property(c => c.CalibratedBy).HasMaxLength(200);

            e.HasOne(c => c.Device).WithMany(d => d.Calibrations).HasForeignKey(c => c.DeviceId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(c => c.ReferenceDevice).WithMany().HasForeignKey(c => c.ReferenceDeviceId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(c => c.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
        });

        // MeasurementPoint
        modelBuilder.Entity<MeasurementPoint>(e =>
        {
            e.Property(m => m.VerificationValue).HasColumnType("decimal(18,7)");
            e.Property(m => m.AscendingValue).HasColumnType("decimal(18,7)");
            e.Property(m => m.DescendingValue).HasColumnType("decimal(18,7)");
            e.Property(m => m.Hysteresis).HasColumnType("decimal(18,7)");
            e.Property(m => m.AbsoluteDifference).HasColumnType("decimal(18,7)");
            e.Property(m => m.Tolerance).HasColumnType("decimal(18,7)");
            e.Property(m => m.Uncertainty).HasColumnType("decimal(18,7)");

            e.HasOne(m => m.Calibration).WithMany(c => c.MeasurementPoints).HasForeignKey(m => m.CalibrationId);
        });

        // ApprovalRequest
        modelBuilder.Entity<ApprovalRequest>(e =>
        {
            e.Property(a => a.Type).HasMaxLength(20);
            e.HasOne(a => a.Calibration).WithMany().HasForeignKey(a => a.CalibrationId).OnDelete(DeleteBehavior.Restrict).IsRequired(false);
            e.HasOne(a => a.Device).WithMany().HasForeignKey(a => a.DeviceId).OnDelete(DeleteBehavior.Restrict).IsRequired(false);
            e.HasOne(a => a.SubmittedByUser).WithMany().HasForeignKey(a => a.SubmittedByUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.ReviewedByUser).WithMany().HasForeignKey(a => a.ReviewedByUserId).OnDelete(DeleteBehavior.Restrict).IsRequired(false);
        });

        // CalibrationFile
        modelBuilder.Entity<CalibrationFile>(e =>
        {
            e.Property(f => f.FileName).HasMaxLength(256);
            e.Property(f => f.StoredFileName).HasMaxLength(256);
            e.Property(f => f.ContentType).HasMaxLength(100);
            e.HasOne(f => f.Calibration).WithMany(c => c.Files).HasForeignKey(f => f.CalibrationId);
        });

        // Procedure
        modelBuilder.Entity<Procedure>(e =>
        {
            e.HasIndex(p => p.ProcedureNumber).IsUnique();
            e.Property(p => p.ProcedureNumber).HasMaxLength(20);
            e.Property(p => p.Name).HasMaxLength(200);
            e.Property(p => p.Version).HasMaxLength(20);
            e.HasOne(p => p.CalibrationType).WithMany().HasForeignKey(p => p.CalibrationTypeId).IsRequired(false);
        });
    }
}
