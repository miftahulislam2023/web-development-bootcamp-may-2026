<!-- Sidebar (Only Chat Menu) -->
<div id="kt_aside" class="aside aside-dark aside-hoverable chat-sidebar">
    <div class="aside-logo flex-column-auto px-5 py-4">
        <a href="#" class="d-flex align-items-center">
            <span class="text-white fw-bold fs-3">💬 ChatApp</span>
        </a>
    </div>

    <div class="aside-menu flex-column-fluid px-3">
        <div class="hover-scroll-overlay-y my-5" id="kt_aside_menu_wrapper">
            <div class="menu menu-column menu-rounded menu-title-gray-600 menu-icon-muted menu-active-bg-primary menu-state-primary fw-semibold fs-6">

                <!-- Chat Menu -->
                <div class="menu-item">
                    <a href="#" class="menu-link active">
                        <span class="menu-icon">
                            <i class="fas fa-comments fs-2"></i>
                        </span>
                        <span class="menu-title">Chats</span>
                    </a>
                </div>

                <!-- Sub Menu -->
                <div class="menu-item pt-2">
                    <div class="menu-content">
                        <div class="menu-heading">Conversations</div>
                    </div>
                </div>

                <div class="menu-item">
                    <a href="#" class="menu-link">
                        <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">All Chats</span>
                        <span class="menu-badge">
                            <span class="badge badge-light">24</span>
                        </span>
                    </a>
                </div>

                <div class="menu-item">
                    <a href="#" class="menu-link">
                        <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">Unread</span>
                        <span class="menu-badge">
                            <span class="badge badge-danger">7</span>
                        </span>
                    </a>
                </div>

                <div class="menu-item">
                    <a href="#" class="menu-link">
                        <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">Groups</span>
                    </a>
                </div>
                <div class="menu-item">
                    <a href="#" class="menu-link">
                        <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">Archived</span>
                    </a>
                </div>

                <!-- Direct Messages -->
                <div class="menu-item pt-5">
                    <div class="menu-content">
                        <div class="menu-heading">Direct Messages</div>
                    </div>
                </div>

                <!--  Users -->
                @foreach ($users as $user)
                <div class="menu-item">
                    <a href="{{ route('chat.index', $user->id) }}" class="menu-link">
                        <div class="symbol symbol-30px me-3">
                            <img src="{{ asset('assets/media/avatars/300-1.jpg') }}" alt="user" class="rounded-circle" />
                        </div>
                        <span class="menu-title">{{ $user->name }}</span>
                    </a>
                </div>
                @endforeach
                <!-- Logout -->
                <div class="menu-item pt-10">

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf

                        <a href="{{ route('logout') }}" class="menu-link text-danger" onclick="event.preventDefault();
                    this.closest('form').submit();">

                            <span class="menu-icon">
                                <i class="fas fa-sign-out-alt fs-2 text-danger"></i>
                            </span>

                            <span class="menu-title">
                                Logout
                            </span>

                        </a>
                    </form>

                </div>

            </div>
        </div>
    </div>
</div>
<!-- End Sidebar -->
