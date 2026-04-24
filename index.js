const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  let invalid_entries = [];
  let duplicate_edges = [];
  let validEdges = [];
  let seen = new Set();

  for (let item of data) {
    if (!item || typeof item !== "string") {
      invalid_entries.push(item);
      continue;
    }

    let trimmed = item.trim();
    if (!/^[A-Z]->[A-Z]$/.test(trimmed)) {
      invalid_entries.push(item);
      continue;
    }

    let [parent, child] = trimmed.split("->");
    if (parent === child) {
      invalid_entries.push(item);
      continue;
    }
    if (seen.has(trimmed)) {
      if (!duplicate_edges.includes(trimmed)) {
        duplicate_edges.push(trimmed);
      }
      continue;
    }

    seen.add(trimmed);
    validEdges.push([parent, child]);
  }

  let childParentMap = {};
  let filteredEdges = [];

  for (let [p, c] of validEdges) {
    if (!childParentMap[c]) {
      childParentMap[c] = p;
      filteredEdges.push([p, c]);
    }
  }

  let graph = {};
  let nodes = new Set();
  let childSet = new Set();

  for (let [p, c] of filteredEdges) {
    if (!graph[p]) graph[p] = [];
    graph[p].push(c);

    nodes.add(p);
    nodes.add(c);
    childSet.add(c);
  }

  let roots = [...nodes].filter(n => !childSet.has(n));

  function dfs(node, path) {
    if (path.has(node)) {
      return { cycle: true };
    }

    path.add(node);

    let tree = {};
    let maxDepth = 1;

    let children = graph[node] || [];

    for (let child of children) {
      let result = dfs(child, new Set(path));

      if (result.cycle) return { cycle: true };

      tree[child] = result.tree;
      maxDepth = Math.max(maxDepth, 1 + result.depth);
    }

    return { tree, depth: maxDepth };
  }

  let visited = new Set();
  let hierarchies = [];
  let total_cycles = 0;

  for (let root of roots) {
    let result = dfs(root, new Set());

    if (result.cycle) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });
      total_cycles++;
    } else {
      hierarchies.push({
        root,
        tree: { [root]: result.tree },
        depth: result.depth
      });
    }

    visited.add(root);
  }

  for (let node of nodes) {
    if (!visited.has(node)) {
      let result = dfs(node, new Set());

      if (result.cycle) {
        hierarchies.push({
          root: node,
          tree: {},
          has_cycle: true
        });
        total_cycles++;
      }
    }
  }

  let total_trees = hierarchies.filter(h => !h.has_cycle).length;

  let largest_tree_root = "";
  let maxDepth = 0;

  for (let h of hierarchies) {
    if (!h.has_cycle) {
      if (
        h.depth > maxDepth ||
        (h.depth === maxDepth && h.root < largest_tree_root)
      ) {
        maxDepth = h.depth;
        largest_tree_root = h.root;
      }
    }
  }

  res.json({
    user_id: "akalyatamilvelsenbakam_15082005", 
    email_id: "at8447@srmist.edu.in",
    college_roll_number: "RA2311026050043",

    hierarchies,
    invalid_entries,
    duplicate_edges,

    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});