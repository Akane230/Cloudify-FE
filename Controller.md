# Complete Laravel Controller Setup Guide

## Table of Contents
1. Basic Setup
2. Controller Types
3. Resource Controllers
4. Dependency Injection
5. Request Validation
6. Response Methods
7. Authorization
8. Best Practices
9. API Controllers
10. Complete Examples

---

## 1. Basic Setup

### Creating Controllers

```bash
# Basic controller
php artisan make:controller MessageController

# Resource controller (CRUD methods)
php artisan make:controller MessageController --resource

# API resource controller (no create/edit views)
php artisan make:controller API/MessageController --api

# Controller with model
php artisan make:controller MessageController --model=Message

# Invokable controller (single action)
php artisan make:controller SendMessageController --invokable
```

### Basic Controller Structure

```php
// app/Http/Controllers/MessageController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller
{
    // Your methods here
}
```

---

## 2. Controller Types

### Standard Controller

```php
namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        // List all messages
    }
    
    public function show($id)
    {
        // Show single message
    }
    
    public function store(Request $request)
    {
        // Create new message
    }
    
    public function update(Request $request, $id)
    {
        // Update message
    }
    
    public function destroy($id)
    {
        // Delete message
    }
}
```

### Invokable Controller (Single Action)

```php
namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class SendMessageController extends Controller
{
    // Only one method needed - __invoke
    public function __invoke(Request $request, Conversation $conversation)
    {
        // Send message logic
        $message = $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'content' => $request->content,
        ]);
        
        return response()->json($message, 201);
    }
}

// Route usage:
// Route::post('/conversations/{conversation}/send', SendMessageController::class);
```

### API Controller

```php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // No create() or edit() methods - these are for showing forms
    // Only: index, store, show, update, destroy
}
```

---

## 3. Resource Controllers

### Full Resource Controller (7 Methods)

```php
namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /messages
     */
    public function index()
    {
        $messages = Message::with('sender')->latest()->paginate(20);
        return view('messages.index', compact('messages'));
    }

    /**
     * Show the form for creating a new resource.
     * GET /messages/create
     */
    public function create()
    {
        return view('messages.create');
    }

    /**
     * Store a newly created resource in storage.
     * POST /messages
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'conversation_id' => 'required|exists:conversations,conversation_id',
        ]);
        
        $message = Message::create($validated);
        
        return redirect()->route('messages.show', $message);
    }

    /**
     * Display the specified resource.
     * GET /messages/{message}
     */
    public function show(Message $message)
    {
        return view('messages.show', compact('message'));
    }

    /**
     * Show the form for editing the specified resource.
     * GET /messages/{message}/edit
     */
    public function edit(Message $message)
    {
        return view('messages.edit', compact('message'));
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /messages/{message}
     */
    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);
        
        $message->update($validated);
        
        return redirect()->route('messages.show', $message);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /messages/{message}
     */
    public function destroy(Message $message)
    {
        $message->delete();
        
        return redirect()->route('messages.index');
    }
}
```

### Resource Routes

```php
// routes/web.php or routes/api.php
Route::resource('messages', MessageController::class);

// Generates these routes:
// GET       /messages              -> index
// GET       /messages/create       -> create
// POST      /messages              -> store
// GET       /messages/{message}    -> show
// GET       /messages/{message}/edit -> edit
// PUT/PATCH /messages/{message}    -> update
// DELETE    /messages/{message}    -> destroy

// API resource (excludes create and edit)
Route::apiResource('messages', MessageController::class);

// Only specific methods
Route::resource('messages', MessageController::class)->only(['index', 'show', 'store']);

// Except specific methods
Route::resource('messages', MessageController::class)->except(['destroy']);
```

---

## 4. Dependency Injection

### Constructor Injection

```php
namespace App\Http\Controllers;

use App\Services\MessageService;
use App\Repositories\MessageRepository;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected $messageService;
    protected $messageRepository;
    
    /**
     * Dependencies injected automatically by Laravel
     */
    public function __construct(
        MessageService $messageService,
        MessageRepository $messageRepository
    ) {
        $this->messageService = $messageService;
        $this->messageRepository = $messageRepository;
        
        // Apply middleware in constructor
        $this->middleware('auth');
        $this->middleware('conversation.access')->only(['store', 'update']);
    }
    
    public function store(Request $request)
    {
        // Use injected service
        $message = $this->messageService->sendMessage($request->all());
        return response()->json($message);
    }
}
```

### Method Injection

```php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use App\Services\MessageService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Dependencies injected per method
     * Order doesn't matter - Laravel resolves by type
     */
    public function store(
        Request $request,
        Conversation $conversation,
        MessageService $messageService
    ) {
        $message = $messageService->sendMessage(
            $conversation,
            $request->validated()
        );
        
        return response()->json($message);
    }
}
```

### Route Model Binding

```php
// Automatic model injection
public function show(Message $message)
{
    // Laravel automatically finds Message by ID from route
    // If not found, returns 404
    return response()->json($message);
}

// Custom key
public function show(Message $message)
{
    // Route: /messages/{message:message_id}
    return response()->json($message);
}

// Custom binding in RouteServiceProvider
public function boot()
{
    Route::bind('message', function ($value) {
        return Message::where('message_id', $value)->firstOrFail();
    });
}
```

---

## 5. Request Validation

### Inline Validation

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'content' => 'required|string|max:5000',
        'conversation_id' => 'required|exists:conversations,conversation_id',
        'message_type' => 'in:text,image,video,file',
        'reply_to_message_id' => 'nullable|exists:messages,message_id',
    ]);
    
    $message = Message::create($validated);
    
    return response()->json($message);
}
```

### Form Request Classes (Recommended)

```php
namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation;

class MessageController extends Controller
{
    public function store(SendMessageRequest $request, Conversation $conversation)
    {
        // Request is already validated
        // Authorization already checked
        $validated = $request->validated();
        
        $message = $conversation->messages()->create($validated);
        
        return response()->json($message);
    }
}
```

### Manual Validation

```php
use Illuminate\Support\Facades\Validator;

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'content' => 'required|string|max:5000',
        'message_type' => 'in:text,image,video',
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }
    
    $message = Message::create($validator->validated());
    
    return response()->json($message);
}
```

---

## 6. Response Methods

### JSON Responses (API)

```php
// Success with data
return response()->json($message);
return response()->json(['data' => $message]);

// With status code
return response()->json($message, 201); // Created
return response()->json(['message' => 'Deleted'], 200);

// No content
return response()->json(null, 204);

// Error responses
return response()->json(['error' => 'Unauthorized'], 401);
return response()->json(['error' => 'Forbidden'], 403);
return response()->json(['error' => 'Not found'], 404);
return response()->json(['errors' => $validator->errors()], 422);

// Custom headers
return response()->json($data)
    ->header('X-Custom-Header', 'Value')
    ->cookie('name', 'value', 60);
```

### View Responses (Web)

```php
// Return view
return view('messages.index', compact('messages'));

// With data
return view('messages.show', [
    'message' => $message,
    'conversation' => $conversation,
]);

// With status code
return response()->view('errors.404', [], 404);
```

### Redirect Responses

```php
// To route
return redirect()->route('messages.index');

// With parameters
return redirect()->route('messages.show', ['message' => $message->id]);

// Back to previous page
return back();

// With flash data
return redirect()->route('messages.index')
    ->with('success', 'Message sent successfully!');

// With input (after validation fails)
return back()->withInput()->withErrors($validator);
```

### Download Responses

```php
// Download file
return response()->download($pathToFile);
return response()->download($pathToFile, 'filename.pdf');

// Stream file
return response()->file($pathToFile);

// Force download
return response()->download($pathToFile, 'filename.pdf', [
    'Content-Type' => 'application/pdf',
]);
```

---

## 7. Authorization

### Using Policies

```php
namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct()
    {
        // Apply authorization to all methods
        $this->authorizeResource(Message::class, 'message');
    }
    
    public function update(Request $request, Message $message)
    {
        // Authorization already checked via authorizeResource
        $message->update($request->validated());
        return response()->json($message);
    }
    
    public function destroy(Message $message)
    {
        // Manual authorization check
        $this->authorize('delete', $message);
        
        $message->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
```

### Manual Authorization

```php
public function update(Request $request, Message $message)
{
    // Check if user can update
    if ($message->sender_id !== auth()->id()) {
        abort(403, 'Unauthorized action.');
    }
    
    $message->update($request->validated());
    return response()->json($message);
}

// Using Gate
public function destroy(Message $message)
{
    if (Gate::denies('delete-message', $message)) {
        abort(403);
    }
    
    $message->delete();
    return response()->json(['message' => 'Deleted']);
}
```

### Middleware Authorization

```php
public function __construct()
{
    $this->middleware('can:update,message')->only('update');
    $this->middleware('can:delete,message')->only('destroy');
}
```

---

## 8. Best Practices

### Keep Controllers Thin

❌ **Bad - Fat Controller**
```php
public function store(Request $request)
{
    $validated = $request->validate([...]);
    
    // Too much logic in controller!
    DB::beginTransaction();
    try {
        $message = Message::create($validated);
        
        // Update conversation
        $conversation = Conversation::find($validated['conversation_id']);
        $conversation->updated_at = now();
        $conversation->save();
        
        // Update read status
        ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', auth()->id())
            ->update(['last_read_message_id' => $message->id]);
        
        // Create delivery statuses
        $participants = $conversation->participants()
            ->where('user_id', '!=', auth()->id())
            ->get();
        
        foreach ($participants as $participant) {
            MessageStatus::create([
                'message_id' => $message->id,
                'user_id' => $participant->user_id,
                'status' => 'sent',
            ]);
        }
        
        // Send notifications
        foreach ($participants as $participant) {
            $participant->user->notify(new NewMessageNotification($message));
        }
        
        // Broadcast event
        broadcast(new MessageSent($message));
        
        DB::commit();
        return response()->json($message);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
```

✅ **Good - Thin Controller**
```php
public function store(SendMessageRequest $request, Conversation $conversation)
{
    // Delegate to service
    $message = $this->messageService->sendMessage(
        $conversation,
        auth()->id(),
        $request->validated()
    );
    
    return new MessageResource($message);
}
```

### Use Type Hints

```php
// ✅ Good - Type hints for everything
public function store(
    SendMessageRequest $request,
    Conversation $conversation,
    MessageService $messageService
): JsonResponse {
    $message = $messageService->sendMessage(
        $conversation,
        $request->validated()
    );
    
    return response()->json($message, 201);
}

// ❌ Bad - No type hints
public function store($request, $conversation)
{
    // Less clear, no IDE support
}
```

### Use Resource Classes for Responses

```php
// ✅ Good - Consistent API responses
public function show(Message $message)
{
    return new MessageResource($message);
}

public function index()
{
    $messages = Message::paginate(20);
    return MessageResource::collection($messages);
}

// ❌ Bad - Inconsistent structure
public function show(Message $message)
{
    return response()->json([
        'id' => $message->id,
        'content' => $message->content,
        // Structure might differ across methods
    ]);
}
```

### Single Responsibility

```php
// ✅ Good - Each controller handles one resource
class MessageController extends Controller
{
    // Only message operations
}

class ConversationController extends Controller
{
    // Only conversation operations
}

// ❌ Bad - Mixed responsibilities
class ChatController extends Controller
{
    public function sendMessage() {}
    public function createConversation() {}
    public function updateUserProfile() {}
    public function deleteAccount() {}
}
```

### Consistent Method Names

```php
// ✅ Good - RESTful naming
public function index()   // List all
public function show()    // Show one
public function store()   // Create
public function update()  // Update
public function destroy() // Delete

// ❌ Bad - Inconsistent names
public function getAllMessages() {}
public function fetchMessage() {}
public function createNewMessage() {}
public function removeMessage() {}
```

---

## 9. API Controllers Best Practices

### Complete API Controller Example

```php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected $messageService;
    
    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
        $this->middleware('auth:sanctum');
    }
    
    /**
     * Get messages for a conversation
     * GET /api/conversations/{conversation}/messages
     */
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);
        
        $perPage = $request->input('per_page', 50);
        $beforeMessageId = $request->input('before');
        
        $messages = $conversation->messages()
            ->with(['sender', 'reactions', 'replyTo'])
            ->when($beforeMessageId, function($query, $id) {
                return $query->where('message_id', '<', $id);
            })
            ->latest()
            ->limit($perPage)
            ->get();
        
        return response()->json([
            'data' => MessageResource::collection($messages),
            'meta' => [
                'has_more' => $messages->count() === $perPage,
                'last_message_id' => $messages->last()?->message_id,
            ]
        ]);
    }
    
    /**
     * Send a message
     * POST /api/conversations/{conversation}/messages
     */
    public function store(
        SendMessageRequest $request,
        Conversation $conversation
    ): JsonResponse {
        $message = $this->messageService->sendMessage(
            $conversation,
            auth()->id(),
            $request->validated()
        );
        
        return (new MessageResource($message))
            ->response()
            ->setStatusCode(201);
    }
    
    /**
     * Get a specific message
     * GET /api/messages/{message}
     */
    public function show(Message $message): JsonResponse
    {
        $this->authorize('view', $message);
        
        return response()->json([
            'data' => new MessageResource($message->load(['sender', 'reactions']))
        ]);
    }
    
    /**
     * Update a message
     * PUT/PATCH /api/messages/{message}
     */
    public function update(
        UpdateMessageRequest $request,
        Message $message
    ): JsonResponse {
        $this->authorize('update', $message);
        
        $message = $this->messageService->updateMessage(
            $message,
            $request->validated()
        );
        
        return response()->json([
            'data' => new MessageResource($message)
        ]);
    }
    
    /**
     * Delete a message
     * DELETE /api/messages/{message}
     */
    public function destroy(Message $message): JsonResponse
    {
        $this->authorize('delete', $message);
        
        $this->messageService->deleteMessage($message);
        
        return response()->json([
            'message' => 'Message deleted successfully'
        ], 200);
    }
    
    /**
     * Mark messages as read
     * POST /api/conversations/{conversation}/read
     */
    public function markAsRead(Conversation $conversation): JsonResponse
    {
        $this->messageService->markAsRead($conversation, auth()->id());
        
        return response()->json([
            'message' => 'Messages marked as read'
        ]);
    }
}
```

### API Response Format

```php
// Success responses
return response()->json([
    'data' => $resource,
    'message' => 'Success message',
    'meta' => [
        'timestamp' => now(),
    ]
]);

// Error responses
return response()->json([
    'error' => 'Error message',
    'code' => 'ERROR_CODE',
    'details' => [] // Optional details
], 400);

// Validation errors (automatic from FormRequest)
{
    "message": "The given data was invalid.",
    "errors": {
        "content": ["The content field is required."]
    }
}
```

---

## 10. Complete Examples

### Messenger Message Controller (Full Implementation)

```php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected $messageService;
    
    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }
    
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        if (!$conversation->participants->contains(auth()->id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $messages = $conversation->messages()
            ->with(['sender', 'reactions', 'replyTo'])
            ->latest()
            ->paginate($request->input('per_page', 50));
        
        return response()->json([
            'data' => MessageResource::collection($messages),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'total' => $messages->total(),
            ]
        ]);
    }
    
    public function store(
        SendMessageRequest $request,
        Conversation $conversation
    ): JsonResponse {
        $message = $this->messageService->sendMessage(
            $conversation,
            auth()->id(),
            $request->validated()
        );
        
        return response()->json([
            'data' => new MessageResource($message),
            'message' => 'Message sent successfully'
        ], 201);
    }
    
    public function show(Message $message): JsonResponse
    {
        $conversation = $message->conversation;
        
        if (!$conversation->participants->contains(auth()->id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'data' => new MessageResource($message->load(['sender', 'reactions']))
        ]);
    }
    
    public function update(
        UpdateMessageRequest $request,
        Message $message
    ): JsonResponse {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $message->update([
            'content' => $request->content,
            'is_edited' => true,
            'edited_at' => now(),
        ]);
        
        return response()->json([
            'data' => new MessageResource($message),
            'message' => 'Message updated successfully'
        ]);
    }
    
    public function destroy(Message $message): JsonResponse
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $message->update([
            'is_deleted' => true,
            'deleted_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }
}
```

### Conversation Controller

```php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateConversationRequest;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    protected $conversationService;
    
    public function __construct(ConversationService $conversationService)
    {
        $this->conversationService = $conversationService;
    }
    
    public function index(Request $request): JsonResponse
    {
        $conversations = auth()->user()
            ->conversations()
            ->with(['participants', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->latest('updated_at')
            ->paginate(20);
        
        return response()->json([
            'data' => ConversationResource::collection($conversations)
        ]);
    }
    
    public function store(CreateConversationRequest $request): JsonResponse
    {
        $conversation = $this->conversationService->createConversation(
            auth()->id(),
            $request->validated()
        );
        
        return response()->json([
            'data' => new ConversationResource($conversation),
            'message' => 'Conversation created successfully'
        ], 201);
    }
    
    public function show(Conversation $conversation): JsonResponse
    {
        if (!$conversation->participants->contains(auth()->id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'data' => new ConversationResource(
                $conversation->load(['participants', 'messages'])
            )
        ]);
    }
    
    public function destroy(Conversation $conversation): JsonResponse
    {
        if (!$conversation->participants->contains(auth()->id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Remove user from conversation
        $conversation->participants()->detach(auth()->id());
        
        return response()->json([
            'message' => 'Left conversation successfully'
        ]);
    }
}
```

---

## Quick Reference

### Controller Artisan Commands
```bash
php artisan make:controller NameController              # Basic
php artisan make:controller NameController --resource   # Resource
php artisan make:controller NameController --api        # API Resource
php artisan make:controller NameController --invokable  # Single action
php artisan make:controller NameController --model=Name # With model
```

### Common Response Status Codes
- `200` - OK (Success)
- `201` - Created
- `204` - No Content (Successful deletion)
- `400` - Bad Request
- `401` - Unauthorized (Not authenticated)
- `403` - Forbidden (Not authorized)
- `404` - Not Found
- `422` - Unprocessable Entity (Validation failed)
- `500` - Internal Server Error

### Controller Middleware
```php
$this->middleware('auth');
$this->middleware('auth:sanctum');
$this->middleware('throttle:60,1'); // Rate limiting
$this->middleware('verified'); // Email verified
$this->middleware('can:update,message')->only('update');
```

### Best Practices Checklist

✅ **DO:**
- Keep controllers thin (use Services)
- Use Form Requests for validation
- Use Resource classes for responses
- Type hint all parameters
- Use route model binding
- Apply authorization checks
- Return consistent response formats
- Document your methods

❌ **DON'T:**
- Put business logic in controllers
- Query the database directly (use Services/Repositories)
- Return inconsistent response formats
- Skip authorization checks
- Forget error handling
- Use generic variable names
- Skip type hints

This guide covers everything you need to build professional Laravel controllers!
