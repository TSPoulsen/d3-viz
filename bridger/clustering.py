from sklearn.cluster import KMeans
import numpy as np
import pandas as pd

data_url = '/home/tim/repositories/itu/bringo/data/all_pair_KLD.csv'

data_ori = pd.read_csv(data_url,sep=',')
cols = list(data_ori.columns)
data = np.array(data_ori)

clf = KMeans(n_clusters=6).fit(data)
sorte = list(zip(cols,clf.labels_))
final = [name for name,lab in sorted(sorte,key=lambda x:x[1])]
sorted_data = []
for name in final:
    idx = cols.index(name)
    row = []
    for name2 in final:
        idx2 = cols.index(name2)
        row.append(str(data[idx,idx2]))
    sorted_data.append(row)
print(','.join(final))
for row in sorted_data:
    print(','.join(row))



