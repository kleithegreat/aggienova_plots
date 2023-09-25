## short term:
- feature to plot all supernovae of a certain type
    - types are listed in csv not dat
- feature to make a certain supernova distinct from others: highlight/bold

- magnitude normalization
    - # **distance modulus**
        - absolute magnitude = apparant magnitude - modulus
        - $\mu = m - M$
        - modulus in distance_best column in csv file

- matching up colors (subtracting magnituides of different filters)
    - selecting which filters to compare
    - some epochs might be missing certain filters - plot only available data
> problem from before: replots all graphs and takes a long time when you want to change colors

- add more options to customize the graph appearance

---

## long term:
- x axis days since explosion
- benchmark efficiency
    - plotting backend in julia if necessary?
- custom plotting instead of plotly?
- make into full stack

- tailwind? react?