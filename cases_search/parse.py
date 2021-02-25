import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import json


def findInc(x,byday,minthresh = 0.05,maxthresh = 0.25,rateDay = 5):
    top = byday.index(max(byday))
    i = top
    rate = float("inf")
    while(i >= 0 and rate < maxthresh):
        rate = (x[i]-x[i-rateDay])/x[i]
        i-=1
    while(i >= 0 and rate > minthresh):
        try:
            rate = (x[i]-x[i-rateDay])/x[i]
        except ZeroDivisionError:
            break
        i-= 1
    second = min(top+10,len(x)-1)
    return (i,second,top)

def cumulate(x):
    cumu = 0
    vector = [cumu:=cumu+val for val in x]
    return vector


df = pd.read_csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_deaths_per_million.csv")
df = df.fillna(0)
npframe = np.array(df)
dates = list(df["date"])
countries = list(df.columns)[1:]
final_df = {}
final_df["Day"] = [i for i in range(1,210)]
final_intervals = {}
final_intervals["Info"] = ["Date start","Date end","Index of max deaths"]
not_in = []
maxL = 0
for i,country in enumerate(countries,start = 1):
    country = country.replace(" ","_")
    cumulated = cumulate(npframe[:,i])
    f,s,top = findInc(x = cumulated,byday=list(npframe[:,i]))
    L = s-f
    if(L < 10):
        not_in.append(country)
        continue
    before = maxL
    maxL = max(maxL,L)
    if(maxL != before): print(country,maxL)
    data = cumulated[f:s]
    final_df[country] = {"data":data,"additional":[dates[f],dates[s],top] }

print("Countries not in new dataset:\t",len(not_in),"/",len(countries))
outfile = open("data.json","w")
json.dump(final_df,outfile,indent = 2)
#plot = sns.scatterplot(x='date',y='Hungary',data = df)
#plt.show()
