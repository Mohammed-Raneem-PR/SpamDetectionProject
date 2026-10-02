import matplotlib.pyplot as plt
import numpy as np

cm = np.array([
    [1150, 6],
    [19, 331]
])

labels = ["Ham", "Spam"]

plt.figure(figsize=(7, 6))

plt.imshow(cm, cmap="Blues")

plt.title("Confusion Matrix - Social Network Spam Detection")
plt.xlabel("Predicted")
plt.ylabel("Actual")

plt.xticks(range(2), labels)
plt.yticks(range(2), labels)

for i in range(2):
    for j in range(2):
        plt.text(
            j,
            i,
            cm[i, j],
            ha="center",
            va="center",
            fontsize=16
        )

plt.colorbar(label="Number of Samples")
plt.tight_layout()

plt.savefig("confusion_matrix.png", dpi=300)
plt.show()