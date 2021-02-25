import numpy as np
import pandas as pd
import sys

data = pd.read_csv("data.csv")

np_data = np.array([data["date"],data["total_vaccinations"],data["people_fully_vaccinated"].fillna(0)])
# Drop first to start on a monday
np_data = np_data.T[1:,:]
for i in range(np_data.shape[0]-1,1,-1):
    tot_diff = np_data[i,1]-np_data[i-1,1]
    pep_diff = np_data[i,2]-np_data[i-1,2]
    np_data[i,1] = tot_diff
    np_data[i,2] = pep_diff

weekly_data = []
max_i = np_data.shape[0] - np_data.shape[0]%7
j = 1
for i in range(0,max_i,7):
    total_vac = np.sum(np_data[i:i+7,1])
    if(i==0): week = "Week 53"
    else: 
        week = f"Week {j}"
        j+=1
    fully_vac = np.sum(np_data[i:i+7,2])
    
    weekly_data.append([week,total_vac,fully_vac])

pd_weekly_data =pd.DataFrame(weekly_data)
pd_weekly_data.to_csv("weekly_data.csv",index=False,header=["Week","vaccinated_people","fully_vaccinated_people"])





''
