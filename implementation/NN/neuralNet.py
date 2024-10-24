import torch
import torch.nn as nn
from torch.optim import Adam

# Define model 
class Net(nn.Module):
    def __init__(self,input_size,output_size):
        super(net,self).__init__()
        self.l1 = nn.Linear(input_size,5)
        self.relu = nn.ReLU()
        self.l2 = nn.Linear(5,output_size)

    def forward(self,x):
        output = self.l1(x) 
        output = self.relu(output)
        output = self.l2(output)
        return output

# Instantiate model
input_size = 3
hidden_size = 6  
num_classes = 10
net = Net(input_size, hidden_size, num_classes)

# Initialize weights  
def init_weights(m):
    if type(m) == nn.Linear:
        nn.init.xavier_uniform_(m.weight)

net.apply(init_weights)

def predict(x):
    output = net.forward(x)
    if output < 0.3:
        return "bad"

# Loss and optimizer
criterion = nn.CrossEntropyLoss()  
optimizer = Adam(net.parameters()) 

# Generate dummy data
import torch 
X = torch.rand(64, 28*28) 
y = torch.randint(0, num_classes, (64,))

# Train  
for epoch in range(10):
    optimizer.zero_grad()  
    outputs = net(X)
    loss = criterion(outputs, y)
    loss.backward()        
    optimizer.step()

