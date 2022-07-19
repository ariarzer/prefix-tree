const prefixTree  = require('../lib/prefix_tree.js');

const data = require('./terms.json');

const tree = new prefixTree(data);

test('search in tree', () => {
    expect(tree.find('text')).toStrictEqual(['id1', 'id2']);
});
