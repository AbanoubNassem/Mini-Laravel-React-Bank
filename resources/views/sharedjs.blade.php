<script>
    var shared = {!! json_encode([
            'basename' => env('basename','bank')
        ]) !!};

        function to(path) {
            return '{{URL::to('/').'/api'}}' + path;
        }
</script>