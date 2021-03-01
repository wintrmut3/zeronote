## Useful Things
- https://www.taniarascia.com/content-editable-elements-in-javascript-react/
  
### Demo
```
# box1
Gibbs Phenomenon - Only appears for jump discontinuities, resulting in overshoots around the DCs

# box2
Fourier Coefficent
B'=-\nabla \times E

# box3
Fourier Coefficent
B'=-\nabla \times E

# box4
Fourier Coefficent
B'=-\nabla \times E


# end
```

### Exporting
I'm still working on rendering to PDF, but:
- The export just opens the preview div in its own window
- Chrome's print option to set up:
  - Scaling to custom - something smaller if there's no clipping
  - Enable "Background Graphics" for coloured headers
  - Use paper size > letter

### Ideas for Improvement
* Highlighting (eg. colors for RMK, DEF)
* Intra-line bold, italic, equation processing using regex replace instead of match
* Collapsible Outliner
* Savable data URLs (eg. can export text data as URL, will be updated live)
* Image resizing
* Paste image into note