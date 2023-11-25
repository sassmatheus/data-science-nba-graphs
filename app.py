import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np
from flask import Flask, request, render_template
import locale


app = Flask(__name__)

data = pd.read_csv('data/nba_dados.csv')
data.dropna(subset=['Salary'], inplace=True)

X = data[['3P', '2P', 'TRB', 'AST', 'BLK']]
y = data['Salary']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

model = LinearRegression()

model.fit(X_train, y_train)

@app.route('/')
def index():
    return render_template('formulario.html')

@app.route('/processar', methods=['POST'])
def processar():
    tres_pts = float(request.form['tres_pts'])
    dois_pts = float(request.form['dois_pts'])
    rebotes = float(request.form['rebotes'])
    assists = float(request.form['assists'])
    blocks = float(request.form['blocks'])

    # user_input recebe dados vindo form
    user_input = np.array([[tres_pts, dois_pts, rebotes, assists, blocks]])
    
    # predicao usando user_input
    salario_estimado = model.predict(user_input)
    salario_estimado = round(salario_estimado[0], 2)

    def formatar_salario(number):
        locale.setlocale(locale.LC_ALL, 'en_US')
        formatted_number = locale.format_string("%.2f", number, grouping=True)
        return formatted_number
    
    salario_formatado = formatar_salario(salario_estimado)

    return f'Estimativa de Salário: ${salario_formatado}'

if __name__ == '__main__':
    app.run(debug=True)
