import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import warnings
import numpy as np

data = pd.read_csv('data/nba_dados.csv')
warnings.filterwarnings("ignore")
data.dropna(inplace=True)

# colunas utilizadas
columns = ['FG', 'FGA', 'FG%', '3P', '3PA', '3', '2P', '2PA', '2', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PTS']

X = data[columns]
y = data['Salary']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=23)

# Criacao do modelo
model = LinearRegression()
# Treinamento
model.fit(X_train, y_train)
# Predicoes no conjunto de teste
y_pred = model.predict(X_test)

# Insercao de dados
input_stats = np.array([[11.0,20.1,0.548,1.0,3.0,0.33,10.0,17.1,0.587,10.0,11.7,0.857,1.7,8.4,10.2,4.2,1.0,1.7,3.4,33.1]])
# Treinamento do input
estimated_salary = model.predict(input_stats)

print(f'Estimativa de Salário: ${estimated_salary[0]:.2f}')
