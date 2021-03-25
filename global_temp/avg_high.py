import pandas as pd
import urllib.request
from tqdm import tqdm
import numpy as np

# GLOBAL CONSTANTS #
col_names = ["Date number","Year","Month","Day","Day of the Year","Anomaly"]
base_high = 14.46
url = "http://berkeleyearth.lbl.gov/auto/Global/Complete_TMAX_daily.txt"

# HELPER FUNCTIONS #
def stripper(line: str) -> list:
    ls = line.split()
    ls = map(lambda x: x.strip(),ls)
    final = []
    for ele in ls:
        if ele: final.append(ele)
    assert len(final) == 6

    return final

# PARSING FILE #
table = []
infile = urllib.request.urlopen(url)
for line in tqdm(infile, desc='Data Parsing'):
    line = line.decode("UTF-8").strip()
    if line:
        if line[0] == "%":
            continue
        table.append(stripper(line))

df = pd.DataFrame(table,columns=col_names)
df.iloc[:,1:5] = df.iloc[:,1:5].astype(int)
df.iloc[:,5] = df.iloc[:,5].astype(float)

years = np.unique(df.iloc[:,1])

# DF SUMMARY PROCESSING #








