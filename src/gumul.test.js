import Gumul from './gumul'

test('Gumul loaded', () => {
	expect(Gumul('test')).toBe('abc')
})