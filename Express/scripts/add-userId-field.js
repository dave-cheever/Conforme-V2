const mongoose = require('mongoose');
const path = require('path');

// Try to load environment variables from different possible locations
try {
  require('dotenv').config({ path: './env/.env' });
} catch (error) {
  try {
    require('dotenv').config({ path: './env/dev.env' });
  } catch (error2) {
    try {
      require('dotenv').config({ path: path.join(__dirname, '../env/.env') });
    } catch (error3) {
      try {
        require('dotenv').config({ path: path.join(__dirname, '../env/dev.env') });
      } catch (error4) {
        console.log('Could not load .env file, using system environment variables');
      }
    }
  }
}

/**
 * Standalone script to add userId field to all users and populate it with their _id values
 * This ensures each user record has both _id and userId fields with the same value
 * 
 * Usage: node scripts/add-userId-field.js [organizationId]
 */

async function addUserIdField(organizationId = null) {
  const connectionString = process.env.DB_CONNECTION_STRING;
  
  if (!connectionString) {
    console.error('❌ DB_CONNECTION_STRING environment variable is not set');
    console.error('Please make sure your environment file is loaded correctly');
    process.exit(1);
  }
  
  console.log('🔗 Database connection string found');
  console.log('Connecting to MongoDB...');
  
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Define a simple user schema for this migration
    const userSchema = new mongoose.Schema({
      _id: String,
      userId: String,
      organizationsIds: [String],
      metatags: {
        removedAt: Date,
        updatedAt: Date,
        updatedBy: String
      }
    }, { collection: 'users' });
    
    const User = mongoose.model('User', userSchema);
    
    // Build query - if organizationId is provided, filter by it
    let query = { 'metatags.removedAt': { $eq: null } };
    if (organizationId) {
      query.organizationsIds = { $in: [organizationId] };
      console.log(`🔍 Filtering users for organization: ${organizationId}`);
    } else {
      console.log('🌍 Processing all users across all organizations');
    }
    
    // Get all users
    console.log('📋 Fetching users from database...');
    const users = await User.find(query).lean();
    console.log(`📊 Found ${users.length} users to process`);
    
    if (users.length === 0) {
      console.log('ℹ️  No users found to update');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log('🔄 Starting user updates...');
    
    // Process each user
    for (const user of users) {
      try {
        // Check if userId field already exists and has a value
        if (user.userId && user.userId === user._id) {
          console.log(`⏭️  User ${user._id} already has userId field set correctly, skipping`);
          skippedCount++;
          continue;
        }
        
        // Update the user to add userId field with the same value as _id
        const result = await User.updateOne(
          { _id: user._id },
          { 
            $set: { 
              userId: user._id,
              'metatags.updatedAt': new Date(),
              'metatags.updatedBy': 'migration-script'
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Successfully updated user ${user._id} with userId: ${user._id}`);
          updatedCount++;
        } else {
          console.log(`ℹ️  No changes made to user ${user._id}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating user ${user._id}:`, error.message);
        errorCount++;
      }
    }
    
    const summary = {
      totalUsers: users.length,
      updatedUsers: updatedCount,
      skippedUsers: skippedCount,
      errorCount: errorCount,
      organizationId: organizationId || 'all',
      timestamp: new Date().toISOString()
    };
    
    console.log('\n=== Migration Summary ===');
    console.log(`Total users processed: ${summary.totalUsers}`);
    console.log(`Users updated: ${summary.updatedUsers}`);
    console.log(`Users skipped: ${summary.skippedUsers}`);
    console.log(`Errors: ${summary.errorCount}`);
    console.log(`Organization: ${summary.organizationId}`);
    console.log(`Timestamp: ${summary.timestamp}`);
    console.log('========================\n');
    
    if (errorCount > 0) {
      console.log(`⚠️  Migration completed with ${errorCount} errors. Please review the logs above.`);
    } else {
      console.log('✅ Migration completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Get organization ID from command line arguments
const organizationId = process.argv[2] || null;

console.log('🚀 Starting userId migration script...');

if (organizationId) {
  console.log(`🎯 Running migration for organization: ${organizationId}`);
} else {
  console.log('🌍 Running migration for all organizations');
}

// Run the migration
addUserIdField(organizationId)
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  }); 