<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>@yield('title', 'Chat Application')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <meta name="user-id" content="{{ auth()->id() }}">

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />

    <!-- Global Styles -->
    <link href="{{ asset('assets/plugins/global/plugins.bundle.css') }}" rel="stylesheet" type="text/css" />

    <link href="{{ asset('assets/css/style.bundle.css') }}" rel="stylesheet" type="text/css" />

    @stack('styles')
</head>

<body id="kt_body" class="header-fixed header-tablet-and-mobile-fixed aside-enabled aside-fixed">

    <div class="d-flex flex-column flex-root">
        <div class="page d-flex flex-row flex-column-fluid">

            {{-- Sidebar --}}
            @include('partials.sidebar')

            {{-- Main Content --}}
            <div class="wrapper d-flex flex-column flex-row-fluid">

                @yield('content')

            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('assets/plugins/global/plugins.bundle.js') }}"></script>

    <script src="{{ asset('assets/js/scripts.bundle.js') }}"></script>

    @stack('scripts')
    @vite(['resources/js/app.js'])

</body>
</html>
