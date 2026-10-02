import matplotlib.pyplot as plt
import numpy as np

algorithms = ["Linear SVM", "Logistic Regression", "Random Forest", "Multinomial NB"]
accuracy = [98.27, 97.14, 96.81, 96.75]
f1_score = [96.22, 93.51, 92.71, 92.97]
precision = [97.93, 99.04, 99.03, 93.37]
recall = [94.57, 88.57, 87.14, 92.57]

x = np.arange(len(algorithms))
width = 0.2

plt.figure(figsize=(10, 6))
plt.bar(x - 1.5*width, accuracy, width, label="Accuracy", color="#2563eb")
plt.bar(x - 0.5*width, precision, width, label="Precision", color="#10b981")
plt.bar(x + 0.5*width, recall, width, label="Recall", color="#f59e0b")
plt.bar(x + 1.5*width, f1_score, width, label="F1 Score", color="#8b5cf6")

plt.ylabel("Score (%)")
plt.title("Machine Learning Algorithms Comparison (Social Network Spam Dataset)")
plt.xticks(x, algorithms)
plt.ylim(80, 102)
plt.legend(loc="lower right")
plt.grid(axis="y", linestyle="--", alpha=0.5)

for i in range(len(algorithms)):
    plt.text(x[i] - 1.5*width, accuracy[i] + 0.6, f"{accuracy[i]:.1f}%", ha="center", fontsize=8, rotation=90)
    plt.text(x[i] - 0.5*width, precision[i] + 0.6, f"{precision[i]:.1f}%", ha="center", fontsize=8, rotation=90)
    plt.text(x[i] + 0.5*width, recall[i] + 0.6, f"{recall[i]:.1f}%", ha="center", fontsize=8, rotation=90)
    plt.text(x[i] + 1.5*width, f1_score[i] + 0.6, f"{f1_score[i]:.1f}%", ha="center", fontsize=8, rotation=90)

plt.tight_layout()
plt.savefig("algorithm_comparison.png", dpi=300)
print("Graph saved as algorithm_comparison.png")
