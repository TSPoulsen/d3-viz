import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import json


def smoothen(x,days=7):
    arr = np.zeros(x.shape)
    for i,val in enumerate(x[days-1:],start=days-1):
        avg = 0
        for j in range(days):
            avg+=x[i-j]
        avg = avg/days
        arr[i] = avg
    return list(arr)
        

df = pd.read_csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_deaths_per_million.csv")
df = df.fillna(0)
npframe = np.array(df)
dates = list(df["date"])
countries = list(df.columns)[1:]
final_df = {}
final_df["date"] = list(df["date"])

for i,country in enumerate(countries,start = 1):
    country = country.replace(" ","_")
    smoothed = smoothen(npframe[:,i])
    final_df[country] = smoothed
print(final_df["Belgium"][100])
outfile = open("deaths_smooth.json","w")
json.dump(final_df,outfile,indent = 2)
#plot = sns.lineplot(x='date',y='Hungary',data = final_df)
#plt.show()