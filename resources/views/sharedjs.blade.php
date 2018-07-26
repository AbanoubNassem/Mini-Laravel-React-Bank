<script>
    var shared = {!! json_encode([
            'basename' => env('BASENAME','bank')
        ]) !!};

        function to(path) {
            return '{{URL::to('/').'/api'}}' + path;
        }
</script>