# Complete Laravel Model Setup Guide

## Table of Contents
1. Basic Setup
2. Table & Primary Key Configuration
3. Fillable vs Guarded
4. Timestamps & Soft Deletes
5. Type Casting
6. Relationships (The Most Important Part!)
7. Accessors & Mutators
8. Scopes
9. Events & Observers
10. Best Practices

---

## 1. Basic Setup

### Creating a Model

```bash
# Create model only
php artisan make:model Message

# Create model + migration
php artisan make:model Message -m

# Create model + migration + controller + factory + seeder
php artisan make:model Message -mcfs

# Create everything (including Form Requests)
php artisan make:model Message --all
```

### Basic Model Structure

```php
// app/Models/Message.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    // Model configuration goes here
}
```

---

## 2. Table & Primary Key Configuration

### Custom Table Name

```php
class Message extends Model
{
    // By default, Laravel uses "messages" (plural, lowercase)
    // Override if your table name is different
    protected $table = 'chat_messages';
}
```

### Custom Primary Key

```php
class Message extends Model
{
    // Default is 'id'
    protected $primaryKey = 'message_id';
    
    // If your primary key is NOT an auto-incrementing integer
    public $incrementing = false;
    
    // If your primary key is not an integer (e.g., UUID)
    protected $keyType = 'string';
}
```

### Example: Message Model with Custom Primary Key

```php
class Message extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'message_id';
    public $incrementing = true;
    protected $keyType = 'int';
}
```

---

## 3. Fillable vs Guarded (Mass Assignment Protection)

### Option 1: Fillable (Whitelist - RECOMMENDED)

```php
class Message extends Model
{
    // Only these fields can be mass-assigned
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'message_type',
        'media_url',
        'reply_to_message_id',
    ];
}

// Now you can do:
Message::create([
    'conversation_id' => 1,
    'sender_id' => 5,
    'content' => 'Hello!',
    'message_type' => 'text',
]);
```

### Option 2: Guarded (Blacklist)

```php
class Message extends Model
{
    // All fields EXCEPT these can be mass-assigned
    protected $guarded = [
        'message_id', // Don't allow setting ID manually
        'is_deleted', // Protect deletion flag
    ];
}
```

### Option 3: Completely Disable Protection (NOT RECOMMENDED)

```php
class Message extends Model
{
    protected $guarded = []; // Allow everything
    // OR
    protected $fillable = ['*']; // Allow everything
}
```

**⚠️ Security Note:** Always use `$fillable` in production. Prevents users from injecting unwanted fields.

---

## 4. Timestamps & Soft Deletes

### Default Timestamps

```php
class Message extends Model
{
    // Laravel automatically manages created_at and updated_at
    public $timestamps = true; // This is default
    
    // If your table doesn't have timestamps
    public $timestamps = false;
    
    // Custom timestamp column names
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'updated_date';
}
```

### Soft Deletes

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;
    
    // Now has deleted_at column
    // Soft deleted records are automatically excluded from queries
}

// Usage:
$message->delete(); // Soft delete (sets deleted_at)
$message->forceDelete(); // Permanent delete
$message->restore(); // Restore soft deleted

// Query soft deleted records
Message::withTrashed()->get(); // Include soft deleted
Message::onlyTrashed()->get(); // Only soft deleted
```

### Migration for Soft Deletes

```php
Schema::table('messages', function (Blueprint $table) {
    $table->softDeletes(); // Adds deleted_at column
});
```

---

## 5. Type Casting (Attributes)

```php
class Message extends Model
{
    protected $casts = [
        // Automatically convert database types
        'is_edited' => 'boolean',
        'is_deleted' => 'boolean',
        'created_at' => 'datetime',
        'edited_at' => 'datetime',
        
        // JSON fields
        'metadata' => 'array', // Converts JSON to array automatically
        
        // Encrypted fields
        'sensitive_data' => 'encrypted',
        
        // Decimal with precision
        'price' => 'decimal:2',
        
        // Integer
        'reaction_count' => 'integer',
        
        // Float
        'rating' => 'float',
    ];
}

// Usage:
$message->is_edited; // Returns boolean true/false, not 1/0
$message->metadata; // Returns array, not JSON string
$message->created_at; // Returns Carbon instance, not string
```

### Custom Casts

```php
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Json implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return json_decode($value, true);
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return json_encode($value);
    }
}

class Message extends Model
{
    protected $casts = [
        'options' => Json::class,
    ];
}
```

---

## 6. Relationships (THE MOST IMPORTANT PART!)

### One-to-Many: Message belongs to User (sender)

```php
class Message extends Model
{
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
        //                       Related Model  Foreign Key  Related Key
    }
}

class User extends Model
{
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id', 'user_id');
    }
}

// Usage:
$message->sender; // Get the User who sent this message
$message->sender->display_name; // Access user properties

$user->messages; // Get all messages sent by this user
```

### One-to-Many: Message belongs to Conversation

```php
class Message extends Model
{
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }
}

class Conversation extends Model
{
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
}

// Usage:
$conversation->messages; // Collection of all messages
$conversation->messages()->latest()->limit(50)->get(); // Query builder
```

### Many-to-Many: Conversation has many Users through Participants

```php
class Conversation extends Model
{
    public function participants()
    {
        return $this->belongsToMany(
            User::class,                    // Related model
            'conversation_participants',    // Pivot table
            'conversation_id',              // Foreign key on pivot
            'user_id',                      // Related key on pivot
            'conversation_id',              // Local key
            'user_id'                       // Related model key
        )
        ->withPivot('role', 'joined_at', 'last_read_message_id') // Include extra pivot columns
        ->withTimestamps(); // Include pivot timestamps
    }
}

class User extends Model
{
    public function conversations()
    {
        return $this->belongsToMany(
            Conversation::class,
            'conversation_participants',
            'user_id',
            'conversation_id'
        )
        ->withPivot('role', 'last_read_message_id')
        ->withTimestamps();
    }
}

// Usage:
$conversation->participants; // All users in conversation
$user->conversations; // All conversations user is in

// Access pivot data
foreach ($conversation->participants as $user) {
    echo $user->pivot->role; // 'admin' or 'member'
    echo $user->pivot->joined_at;
}

// Query with pivot conditions
$conversation->participants()->wherePivot('role', 'admin')->get();
```

### One-to-One: User has one Settings

```php
class User extends Model
{
    public function settings()
    {
        return $this->hasOne(UserSettings::class, 'user_id');
    }
}

class UserSettings extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// Usage:
$user->settings; // Get user's settings
$user->settings->theme; // Access settings properties
```

### Has Many Through: Conversation has Reactions through Messages

```php
class Conversation extends Model
{
    public function reactions()
    {
        return $this->hasManyThrough(
            MessageReaction::class,  // Final model
            Message::class,          // Intermediate model
            'conversation_id',       // Foreign key on messages
            'message_id',            // Foreign key on reactions
            'conversation_id',       // Local key on conversations
            'message_id'             // Local key on messages
        );
    }
}

// Usage:
$conversation->reactions; // All reactions in this conversation
```

### Polymorphic: Attachments can belong to Message or Post

```php
class Attachment extends Model
{
    public function attachable()
    {
        return $this->morphTo();
    }
}

class Message extends Model
{
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}

class Post extends Model
{
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}

// Database columns needed:
// attachable_id (BIGINT)
// attachable_type (VARCHAR) - stores "App\Models\Message"

// Usage:
$message->attachments; // Get message attachments
$attachment->attachable; // Get parent (Message or Post)
```

### Self-Referencing: Message can reply to another Message

```php
class Message extends Model
{
    public function replyTo()
    {
        return $this->belongsTo(Message::class, 'reply_to_message_id', 'message_id');
    }
    
    public function replies()
    {
        return $this->hasMany(Message::class, 'reply_to_message_id', 'message_id');
    }
}

// Usage:
$message->replyTo; // Get the message this is replying to
$message->replies; // Get all replies to this message
```

### Relationship Summary Table

| Relationship | Method | Inverse |
|-------------|--------|---------|
| One to One | `hasOne()` | `belongsTo()` |
| One to Many | `hasMany()` | `belongsTo()` |
| Many to Many | `belongsToMany()` | `belongsToMany()` |
| Has Many Through | `hasManyThrough()` | - |
| Polymorphic One to Many | `morphMany()` | `morphTo()` |
| Polymorphic Many to Many | `morphToMany()` | `morphedByMany()` |

---

## 7. Accessors & Mutators (Getters & Setters)

### Accessors (Getters) - Transform data when retrieving

```php
class User extends Model
{
    // Modern syntax (Laravel 9+)
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucfirst($value),
        );
    }
    
    // Old syntax (still works)
    public function getAvatarUrlAttribute()
    {
        if ($this->profile_picture_url) {
            return $this->profile_picture_url;
        }
        
        // Default avatar
        return "https://ui-avatars.com/api/?name=" . urlencode($this->display_name);
    }
    
    // Create computed attribute
    public function getIsOnlineAttribute()
    {
        if (!$this->last_seen) {
            return false;
        }
        
        return $this->last_seen->gt(now()->subMinutes(5));
    }
    
    // Format dates
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M d, Y');
    }
}

// Usage:
$user->display_name; // Automatically ucfirst
$user->avatar_url; // Returns profile pic or default
$user->is_online; // Computed based on last_seen
$user->formatted_created_at; // "Jan 05, 2025"
```

### Mutators (Setters) - Transform data before saving

```php
class Message extends Model
{
    // Modern syntax
    protected function content(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value,
            set: fn ($value) => strip_tags($value), // Remove HTML
        );
    }
    
    // Old syntax
    public function setContentAttribute($value)
    {
        $this->attributes['content'] = strip_tags($value);
    }
    
    // Hash passwords automatically
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
    
    // Normalize phone numbers
    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone_number'] = preg_replace('/[^0-9]/', '', $value);
    }
}

// Usage:
$message->content = '<script>alert("xss")</script>Hello!';
$message->save();
// Database stores: "Hello!" (tags stripped)

$user->password = 'plain-text-password';
$user->save();
// Database stores: hashed password
```

---

## 8. Scopes (Reusable Query Filters)

### Local Scopes

```php
class Message extends Model
{
    // Scope for unread messages
    public function scopeUnread($query, $userId)
    {
        return $query->whereHas('conversation.participants', function($q) use ($userId) {
            $q->where('user_id', $userId)
              ->whereColumn('messages.message_id', '>', 'conversation_participants.last_read_message_id');
        });
    }
    
    // Scope for text messages only
    public function scopeTextOnly($query)
    {
        return $query->where('message_type', 'text');
    }
    
    // Scope for messages from last N days
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
    
    // Scope for messages from specific sender
    public function scopeFrom($query, $userId)
    {
        return $query->where('sender_id', $userId);
    }
    
    // Scope for not deleted
    public function scopeActive($query)
    {
        return $query->where('is_deleted', false);
    }
}

// Usage - chain scopes together!
Message::unread(auth()->id())
    ->textOnly()
    ->recent(30)
    ->get();

Message::from($userId)
    ->active()
    ->latest()
    ->paginate(50);
```

### Global Scopes (Applied to ALL queries)

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('is_deleted', false);
    }
}

class Message extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new ActiveScope);
        
        // Or use closure
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('is_deleted', false);
        });
    }
}

// Now ALL queries automatically exclude deleted messages
Message::all(); // Only active messages

// Remove global scope when needed
Message::withoutGlobalScope('active')->get();
Message::withoutGlobalScopes()->get();
```

---

## 9. Events & Observers

### Model Events

```php
class Message extends Model
{
    protected static function booted()
    {
        // Before creating
        static::creating(function ($message) {
            if (!$message->message_type) {
                $message->message_type = 'text';
            }
        });
        
        // After creating
        static::created(function ($message) {
            // Update conversation timestamp
            $message->conversation->touch();
        });
        
        // Before updating
        static::updating(function ($message) {
            if ($message->isDirty('content')) {
                $message->is_edited = true;
                $message->edited_at = now();
            }
        });
        
        // Before deleting
        static::deleting(function ($message) {
            // Delete related reactions
            $message->reactions()->delete();
        });
        
        // After deleting
        static::deleted(function ($message) {
            // Log deletion
            activity()->log("Message {$message->message_id} deleted");
        });
    }
}
```

### Available Events

- `retrieved` - After model retrieved from database
- `creating` - Before inserting to database
- `created` - After inserting to database
- `updating` - Before updating
- `updated` - After updating
- `saving` - Before creating OR updating
- `saved` - After creating OR updating
- `deleting` - Before deleting
- `deleted` - After deleting
- `restoring` - Before restoring soft delete
- `restored` - After restoring soft delete

### Observers (Better Organization)

```php
// app/Observers/MessageObserver.php
namespace App\Observers;

use App\Models\Message;

class MessageObserver
{
    public function creating(Message $message)
    {
        $message->message_type = $message->message_type ?? 'text';
    }
    
    public function created(Message $message)
    {
        $message->conversation->touch();
        
        // Create delivery statuses for all participants
        $participants = $message->conversation->participants()
            ->where('user_id', '!=', $message->sender_id)
            ->pluck('user_id');
        
        foreach ($participants as $userId) {
            MessageStatus::create([
                'message_id' => $message->message_id,
                'user_id' => $userId,
                'status' => 'sent',
            ]);
        }
    }
    
    public function updating(Message $message)
    {
        if ($message->isDirty('content')) {
            $message->is_edited = true;
            $message->edited_at = now();
        }
    }
    
    public function deleted(Message $message)
    {
        $message->reactions()->delete();
        $message->statuses()->delete();
    }
}

// Register observer in app/Providers/AppServiceProvider.php
use App\Models\Message;
use App\Observers\MessageObserver;

public function boot()
{
    Message::observe(MessageObserver::class);
}
```

---

## 10. Best Practices & Complete Example

### Complete Messenger Model Example

```php
// app/Models/Message.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Message extends Model
{
    use SoftDeletes;
    
    // 1. Table Configuration
    protected $table = 'messages';
    protected $primaryKey = 'message_id';
    public $timestamps = true;
    
    // 2. Mass Assignment Protection
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'message_type',
        'media_url',
        'reply_to_message_id',
    ];
    
    // 3. Hidden Fields (not in JSON)
    protected $hidden = [
        'deleted_at',
    ];
    
    // 4. Appended Attributes (always in JSON)
    protected $appends = [
        'is_own',
        'formatted_time',
    ];
    
    // 5. Type Casting
    protected $casts = [
        'is_edited' => 'boolean',
        'is_deleted' => 'boolean',
        'created_at' => 'datetime',
        'edited_at' => 'datetime',
    ];
    
    // 6. Relationships
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }
    
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }
    
    public function reactions()
    {
        return $this->hasMany(MessageReaction::class, 'message_id');
    }
    
    public function replyTo()
    {
        return $this->belongsTo(Message::class, 'reply_to_message_id', 'message_id');
    }
    
    public function replies()
    {
        return $this->hasMany(Message::class, 'reply_to_message_id', 'message_id');
    }
    
    public function statuses()
    {
        return $this->hasMany(MessageStatus::class, 'message_id');
    }
    
    // 7. Accessors (Getters)
    protected function isOwn(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sender_id === auth()->id(),
        );
    }
    
    public function getFormattedTimeAttribute()
    {
        return $this->created_at->diffForHumans();
    }
    
    // 8. Mutators (Setters)
    protected function content(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => strip_tags($value),
        );
    }
    
    // 9. Scopes
    public function scopeUnread($query, $userId)
    {
        return $query->whereHas('conversation.participants', function($q) use ($userId) {
            $q->where('user_id', $userId)
              ->whereColumn('messages.message_id', '>', 'last_read_message_id');
        });
    }
    
    public function scopeTextOnly($query)
    {
        return $query->where('message_type', 'text');
    }
    
    public function scopeActive($query)
    {
        return $query->where('is_deleted', false);
    }
    
    // 10. Helper Methods
    public function markAsDelivered($userId)
    {
        return $this->statuses()->updateOrCreate(
            ['user_id' => $userId],
            ['status' => 'delivered', 'timestamp' => now()]
        );
    }
    
    public function markAsRead($userId)
    {
        return $this->statuses()->updateOrCreate(
            ['user_id' => $userId],
            ['status' => 'read', 'timestamp' => now()]
        );
    }
}
```

### Model Best Practices Checklist

✅ **DO:**
- Use `$fillable` instead of `$guarded`
- Define all relationships
- Use type casting for booleans, dates, JSON
- Create scopes for reusable queries
- Use observers for complex event logic
- Add helper methods for common operations
- Hide sensitive fields from JSON
- Use soft deletes instead of hard deletes when possible

❌ **DON'T:**
- Put business logic in models (use Services)
- Make models too fat (split into traits if needed)
- Expose sensitive data in JSON responses
- Skip mass assignment protection
- Forget to eager load relationships (N+1 problem)

---

## Quick Reference Commands

```bash
# Create model with migration
php artisan make:model Message -m

# Create model with everything
php artisan make:model Message --all

# Create observer
php artisan make:observer MessageObserver --model=Message

# Create custom cast
php artisan make:cast Json

# Show all routes for a model
php artisan route:list --name=messages
```

This covers everything you need to know about Laravel models!

