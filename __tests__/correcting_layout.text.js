const correctingLayout  = require('../lib/correcting_layout.js');

test('qwerty => йцукен', () => {
    expect(correctingLayout('qwerty')).toBe('йцукен');
});

test('мито => vbnj', () => {
    expect(correctingLayout('мито')).toBe('vbnj');
});

test('ми то => vb nj', () => {
    expect(correctingLayout('ми то')).toBe('vb nj');
});