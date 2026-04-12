---
title: "Code Highlighting Test"
description: "Testing syntax highlighting in light and dark modes"
date: 2024-01-18
tags:
  - test
  - code
---

# Code Highlighting Test

This note tests syntax highlighting with both light and dark themes.

## JavaScript Example

```javascript
// This is a JavaScript example
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

// Call the function
const result = greet('World');
```

## Python Example

```python
# This is a Python example
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## CSS Example

```css
/* This is a CSS example */
.garden {
  display: flex;
  background: linear-gradient(to right, #4ade80, #22c55e);
  padding: 1rem;
  border-radius: 0.5rem;
}

.garden:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
```

## Inline Code

You can also use `inline code` within paragraphs. Just wrap it in backticks.

## Conclusion

Code blocks should automatically adapt to the light or dark theme!
