**Problem Description:**
1.After adding new row to the table ,the drag and drop is not working to the newly added row 
2.Another bug was if i add multiple rows and try to drag and drop in between the newly added rows also swap is not working

**solution**
Both the issue is coming due to the registerDragEvents() function in addRowCommand() so everytime a row is created it is looping through all the (.box) elements of <Div> element and storing it in newly added row <td>.
so drop and drag is calling twice to fix this i have only looped for newly added row 
