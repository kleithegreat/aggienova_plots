PlotComponent:

```
useEffect when selectedSNe or plot options change:
    if plot type is magnitude:
        for sn in selectedSNe:
            query light_curves table using sn_id for the sn
            add data to be plotted

        if x axis is days since first observation:
            for each sn:
                find the first observation date
                adjust the x values to be days since first observation

        if y axis is absolute:
            for each sn:
                query the `supernovae` table using sn_id for the sn and get the distance modulus
                adjust the y values to be absolute magnitudes
    else:
        implement later

    plot the data
```



## todo
- check if photometry data exists for every selection in sn dropdown
    - do the same for select by type
    - use the mui notification component to display a message if the data is missing