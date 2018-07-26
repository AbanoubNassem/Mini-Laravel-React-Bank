<script>
    var shared = {!! json_encode([
            'basename' => env('BASENAME','bank')
        ]) !!};

    function to(path, route = '/api') {
        return '{{URL::to('/')}}' + route + path;
    }
</script>