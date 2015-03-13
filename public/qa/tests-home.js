suite('Home Page Tests', function(){
	test('Test contact link', function(){
		assert( $('a[href="/contact"]').length );
	});
});