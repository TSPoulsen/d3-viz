import pandas as pd
import numpy as np
import json
df = pd.read_excel('women_parl_raw.xlsx')

outdata = {}
for col in [str(2003+2*i) for i in range(9)]:
    arr  = np.array(df[col]).astype(float)
    outdata[col] = list(arr[np.logical_not(np.isnan(arr))])

with open("women_parl.json","w") as of:
    json.dump(outdata,of,indent=2)


